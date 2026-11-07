# Stage 1: The Kitchen (Maven + Java 21 JDK compiles executor-service into a .jar)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: The Sandbox Container (Java 21 + g++ + Python!)
FROM eclipse-temurin:21-jre
RUN apt-get update && apt-get install -y g++ python3 python-is-python3 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]