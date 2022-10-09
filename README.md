# CSV-File

Logging in CSV format seems to me like a good idea, because it is both, a compact format and human readable.

Naturally, there is a lot of existing modules providing functions to read and write csv files, but all of them seems to me like too much of taking a sledgehammer to crack a nut. So I decided to create my own which only contains the parts needed for this special use case.

Writing a log line is as simple as

    import CSVFile from "csv-file"

    CSVFile("my-log.csv").append({ time: new Date(), message: "An error occured!" })

As CSV files can only have a fixed structure (same fields for all lines), the fields are defined either with the first `append()` call, in which case all visible properties of the given object are used as fields to log. Subsequent `append()` calls will only write those same fields and ignore all others.

It is also possible to read a CSV file - this indeed does break my promise 'only the parts needed', but I have a use case to read my logs later (actually for tests), and didn't want to use another library for that. But this implementation is rather simple, no streaming, only reading the whole file.
