import { beforeEach, describe, expect, it, vi } from "vitest"
import logcsv from "./index"

let statSize = 0

function mockFileSystem(data: string = "") {
  return {
    appendFileSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn().mockReturnValue(data),
    statSync: vi.fn().mockImplementation(() => ({ size: statSize })),
    writeFileSync: vi.fn()
  }
}

describe("logcsv", () => {
  describe("append()", () => {
    beforeEach(() => {
      statSize = 0
    })

    it("should write a title line with all field names of the given object", () => {
      const fs = mockFileSystem()
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      file.append({ test: "abc", "other": "xyz" })
      expect(fs.appendFileSync.mock.calls[0]).toEqual(["test.csv", "test,other\n"])
    })

    it("should not write additional fields of subsequent objects", () => {
      const fs = mockFileSystem()
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      file.append({ test: "abc", "other": "xyz" })
      statSize = 1
      file.append({ different: "123" })
      expect(fs.appendFileSync.mock.calls[2]).toEqual(["test.csv", ",\n"])
    })

    it("should escape double quotes properly", () => {
      const fs = mockFileSystem()
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      file.append({ test: 'abc"xyz' })
      expect(fs.appendFileSync.mock.calls[1]).toEqual(["test.csv", "abc\"\"xyz\n"])
    })

    it("should escape commas properly", () => {
      const fs = mockFileSystem()
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      file.append({ test: 'abc"xyz' })
      expect(fs.appendFileSync.mock.calls[1]).toEqual(["test.csv", "abc\"\"xyz\n"])
    })

    it("should escape newline characters properly", () => {
      const fs = mockFileSystem()
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      file.append({ test: "abc\nxyz" })
      expect(fs.appendFileSync.mock.calls[1]).toEqual(["test.csv", "\"abc\\nxyz\"\n"])
    })
  })

  describe("read", () => {
    it("should read the given file as an array of objects", () => {
      const fs = mockFileSystem(`test,other\n"abc",def\n123,456\n`)
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      expect(file.read()).toEqual([{ test: "abc", other: "def" }, { test: "123", other: "456" }])
    })

    it("should unescape all characters properly", () => {
      const csv = `test,other\n"123""abc",def\nghi,\n"uvw\\nx,yz",456\n`
      const fs = mockFileSystem(csv)
      const file = logcsv("test.csv")
      file.injectFileSystem(fs)
      expect(file.read()).toEqual([
        { test: "123\"abc", other: "def" },
        { test: "ghi", other: "" },
        { test: "uvw\nx,yz", other: "456" }
      ])
    })
  })
})