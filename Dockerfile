FROM postgres:14.6
EXPOSE 5432
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=EchoChamber
ADD ./server/sql/init.sql /docker-entrypoint-initdb.d/