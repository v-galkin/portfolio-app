package com.vg.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vg.portfolio.model.ContainerInfo;
import com.vg.portfolio.model.ContainerStats;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class DockerService {

    private static final String SOCKET_PATH = "/var/run/docker.sock";
    private static final String DASHBOARD_LABEL = "dashboard=true";
    private final ObjectMapper objectMapper = new ObjectMapper();

    // SEND REQUEST TO DOCKER SOCKET
    private String sendRequest(String method, String urlPath) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(
                "curl", "--silent",
                "--unix-socket", SOCKET_PATH,
                "-X", method,
                "-H", "Content-Type: application/json",
                "http://localhost" + urlPath
        );
        pb.redirectErrorStream(true);
        Process process = pb.start();
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
        );
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        process.waitFor();
        return response.toString();
    }

    // LIST ALL CONTAINERS
    public List<ContainerInfo> listAllContainers() throws Exception {
        String response = sendRequest("GET", "/containers/json?all=true");
        return parseContainers(response);
    }

    // LIST DASHBOARD LABELLED CONTAINERS
    public List<ContainerInfo> listDashboardContainers() throws Exception {
        String filter = URLEncoder.encode(
                "{\"label\":[\"" + DASHBOARD_LABEL + "\"]}",
                StandardCharsets.UTF_8
        );
        String response = sendRequest("GET", "/containers/json?all=true&filters=" + filter);
        return parseContainers(response);
    }

    // LIST PUBLIC CONTAINERS - RUNNING AND LABELLED ONLY
    public List<ContainerInfo> listPublicContainers() throws Exception {
        String filter = URLEncoder.encode(
                "{\"label\":[\"" + DASHBOARD_LABEL + "\"],\"status\":[\"running\"]}",
                StandardCharsets.UTF_8
        );
        String response = sendRequest("GET", "/containers/json?filters=" + filter);
        return parseContainers(response);
    }

    // START A CONTAINER
    public void startContainer(String containerId) throws Exception {
        sendRequest("POST", "/containers/" + containerId + "/start");
    }

    // STOP A CONTAINER
    public void stopContainer(String containerId) throws Exception {
        sendRequest("POST", "/containers/" + containerId + "/stop");
    }

    // GET CONTAINER STATS
    public ContainerStats getContainerStats(String containerId) throws Exception {

        // GET STATS AND INSPECT
        String statsJson = sendRequest("GET", "/containers/" + containerId + "/stats?stream=false");
        String inspectJson = sendRequest("GET", "/containers/" + containerId + "/json");

        JsonNode stats = objectMapper.readTree(statsJson);
        JsonNode inspect = objectMapper.readTree(inspectJson);

        // CPU CALCULATION
        long cpuDelta = stats.path("cpu_stats").path("cpu_usage").path("total_usage").asLong()
                - stats.path("precpu_stats").path("cpu_usage").path("total_usage").asLong();
        long systemDelta = stats.path("cpu_stats").path("system_cpu_usage").asLong()
                - stats.path("precpu_stats").path("system_cpu_usage").asLong();
        int numCpus = stats.path("cpu_stats").path("online_cpus").asInt(1);
        double cpuPercent = systemDelta > 0
                ? (double) cpuDelta / systemDelta * numCpus * 100.0
                : 0.0;

        // MEMORY CALCULATION
        long memUsage = stats.path("memory_stats").path("usage").asLong();
        long memLimit = stats.path("memory_stats").path("limit").asLong();
        double memPercent = memLimit > 0
                ? (double) memUsage / memLimit * 100.0
                : 0.0;

        // NETWORK IN/OUT
        long netIn = 0;
        long netOut = 0;
        JsonNode networks = stats.path("networks");
        if (networks.isObject()) {
            for (JsonNode net : networks) {
                netIn += net.path("rx_bytes").asLong();
                netOut += net.path("tx_bytes").asLong();
            }
        }

        // PORTS
        StringBuilder ports = new StringBuilder();
        JsonNode portBindings = inspect.path("HostConfig").path("PortBindings");
        portBindings.fieldNames().forEachRemaining(port -> {
            JsonNode bindings = portBindings.path(port);
            if (bindings.isArray() && bindings.size() > 0) {
                String hostPort = bindings.get(0).path("HostPort").asText();
                if (ports.length() > 0) ports.append(", ");
                ports.append(hostPort).append(":").append(port.replace("/tcp", ""));
            }
        });

        // RESTART COUNT
        int restartCount = inspect.path("RestartCount").asInt(0);

        // UPTIME
        String startedAt = inspect.path("State").path("StartedAt").asText("");
        String uptime = "";
        if (!startedAt.isEmpty() && !startedAt.equals("0001-01-01T00:00:00Z")) {
            try {
                java.time.Instant start = java.time.Instant.parse(startedAt);
                long seconds = java.time.Duration.between(start, java.time.Instant.now()).getSeconds();
                if (seconds < 60) uptime = seconds + "s";
                else if (seconds < 3600) uptime = (seconds / 60) + "m";
                else if (seconds < 86400) uptime = (seconds / 3600) + "h";
                else uptime = (seconds / 86400) + "d";
            } catch (Exception e) {
                uptime = "unknown";
            }
        }

        return new ContainerStats(
                containerId,
                Math.round(cpuPercent * 100.0) / 100.0,
                memUsage,
                memLimit,
                Math.round(memPercent * 100.0) / 100.0,
                netIn,
                netOut,
                restartCount,
                uptime,
                ports.toString()
        );
    }

    // PARSE JSON RESPONSE INTO CONTAINER LIST
    private List<ContainerInfo> parseContainers(String response) throws Exception {
        JsonNode containers = objectMapper.readTree(response);
        List<ContainerInfo> result = new ArrayList<>();
        for (JsonNode container : containers) {
            String fullId = container.get("Id").asText();
            String name = container.get("Names").get(0).asText().replace("/", "");
            String image = container.get("Image").asText();
            String status = container.get("Status").asText();
            String state = container.get("State").asText();
            result.add(new ContainerInfo(
                    fullId,
                    fullId.substring(0, 12),
                    name,
                    image,
                    status,
                    state
            ));
        }
        return result;
    }
}