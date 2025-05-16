FROM python:3.10-slim

WORKDIR /app

COPY run.py .

# COPY input.txt? /app/   # if you generate input.txt in run.js

COPY input.txt /app/   

COPY code.py .

CMD ["python", "run.py"]
