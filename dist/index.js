import { appendFileSync, existsSync, readFileSync, statSync, writeFileSync } from "fs";
function objectMapper(headers) {
    return (values) => Object.assign({}, ...headers.map((value, index) => ({ [value]: values[index] })));
}
function escape(value) {
    if (value.indexOf("\n")) {
        value = value.replace(/\n/g, "\\n");
    }
    if (value.indexOf(",") >= 0 || value.indexOf("\\") >= 0) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
function unescape(value) {
    if (value.match(/^".*"$/)) {
        return value.slice(1, -1).replace(/""/g, '"').replace(/\\n/g, "\n");
    }
    return value;
}
export default function (fileName, fields = []) {
    function writeLine(data) {
        appendFileSync(fileName, data.map(escape).join(",") + "\n");
    }
    return {
        read() {
            const lines = readFileSync(fileName).toString().split("\n");
            const firstLine = lines.shift();
            if (!firstLine) {
                throw new Error("File doesn't contain a header line!");
            }
            firstLine
                .split(",")
                .map(unescape)
                .forEach((field) => fields.push(field));
            const toObject = objectMapper(fields);
            return lines.map((line) => line.split(",").map(unescape)).map(toObject);
        },
        append(data) {
            if (!existsSync(fileName)) {
                writeFileSync(fileName, "");
            }
            if (!fields.length) {
                Object.keys(data).forEach((field) => fields.push(field));
            }
            if (!statSync(fileName).size) {
                writeLine(fields);
            }
            writeLine(fields.map((field) => "" + data[field]));
        },
    };
}
