## What is it
It's a hello world project to test several frameworks together
Server: dotnet 6 + npgsql + signalR
Client: react + mobx + d3js + signalR

start db:
`docker run -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=d3signal_db -p 5432:5432 postgres:14`