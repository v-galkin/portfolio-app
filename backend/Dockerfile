# ── BUILD STAGE ───────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# ── RUN STAGE ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

# INSTALL CURL FOR DOCKER SOCKET CALLS
RUN apk add --no-cache curl

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# JVM TUNING FOR SMALL INSTANCES (e.g. 1GB RAM Lightsail)
# -XX:+UseContainerSupport        → respect Docker memory limits
# -XX:MaxRAMPercentage=75.0       → use max 75% of container memory
# -XX:+UseG1GC                    → G1 garbage collector, good for low latency
# -XX:+OptimizeStringConcat       → small string optimization
# -Djava.security.egd             → faster startup (entropy source)
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+UseG1GC", \
    "-XX:+OptimizeStringConcat", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]