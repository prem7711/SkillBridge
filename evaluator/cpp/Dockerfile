# # Use the official C++ base image
# FROM gcc:latest

# # Set the working directory in the container
# WORKDIR /app

# # Copy the C++ source code into the container
# COPY run.cpp .

# # Compile the C++ source code
# RUN g++ -o run run.cpp

# # Set the command to run the compiled program
# CMD ["./run"]

# Use the official C++ base image
FROM gcc:latest

# Set working directory
WORKDIR /app

# Copy all necessary runtime files
COPY run.cpp .
COPY code.cpp .
COPY input.txt .

# Compile only run.cpp — which will compile and run code.cpp during container runtime
RUN g++ -o runner run.cpp

# Run the runner, which compiles and runs code.cpp
CMD ["./runner"]
