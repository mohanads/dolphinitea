import os
import subprocess
import sys
import shutil
import dotenv

def load_env_with_interpolation():
    dotenv.load_dotenv()
    for key, value in os.environ.items():
        if isinstance(value, str):
            interpolated = os.path.expandvars(value)
            if interpolated != value:
                os.environ[key] = interpolated

# Initialize environment
load_env_with_interpolation()

# Check if Bun is installed, install if necessary
def ensure_bun():
    if shutil.which("bun") is None:
        print("Bun is not installed. Installing...")
        subprocess.run("curl -fsSL https://bun.sh/install | bash", shell=True, check=True)
        os.environ["PATH"] += os.pathsep + os.path.expanduser("~/.bun/bin")
        print("Bun installed successfully.")

# Install project dependencies
def install_dependencies():
    print("Installing dependencies...")
    subprocess.run("bun install", shell=True, check=True)
    print("Dependencies installed.")

# Build and start the project
def build_and_start():
    print("Building CSS...")
    subprocess.run("bun build:css", shell=True, check=True)

    print("Building client...")
    subprocess.run("bun build:client", shell=True, check=True)

    print("Starting server...")
    subprocess.run("bun server:start", shell=True, check=True)

if __name__ == "__main__":
    try:
        ensure_bun()
        install_dependencies()
        build_and_start()
    except subprocess.CalledProcessError as e:
        print(f"Error during execution: {e}")
        sys.exit(1)
