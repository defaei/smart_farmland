FROM python:3.14-slim-bookworm

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

COPY apps/auth-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY proto /proto
COPY apps/auth-service/ .

RUN mkdir -p gen && python -m grpc_tools.protoc \
    -I /proto --python_out=gen --grpc_python_out=gen /proto/auth/v1/auth.proto

EXPOSE 50051
CMD ["python", "main.py"]