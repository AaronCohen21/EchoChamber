FROM postgres:14.6
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=EchoChamber
EXPOSE 5432
ADD ./server/sql/init.sql /docker-entrypoint-initdb.d/