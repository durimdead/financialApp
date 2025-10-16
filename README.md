This is a living project that will continue to be updated as I learn more.

This project is able to be run with EITHER a MSSQL database OR a PostgreSQL database.
The scripts to create both including some sample data (along with more specified instructions in the case of the postgres database) are included in the /database folder.
You may notice that there are multiple views that give exactly the same information within Postgres - this is part of my learning process as I wanted a "simple" solution for both to work with .NET - I am working on a more elegant solution that does not require 2 views with a differently named schema for each as this is clearly not ideal.


There is a possibilitiy to run the application's Web API in either Node or .NET, but Node currently only loads data, and is incapable of updating or adding anything.

If you wish to switch between databases in .NET, you only need to change the database provider inside the config file (instructions commented within the file).
