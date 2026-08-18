/**
 * pptxgenjs writes the OPC package with empty directory entries and with
 * [Content_Types].xml *after* them, all stored uncompressed. PowerPoint
 * rejects that package ("cannot open the file"), so we repack it into a
 * strict OPC zip: [Content_Types].xml first, no directory entries, deflated.
 */
import { execFileSync } from "node:child_process";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: node scripts/repack-pptx.mjs <in.pptx> <out.pptx>");
  process.exit(1);
}

const py = `
import zipfile, shutil, sys
src, dst = sys.argv[1], sys.argv[2]
zin = zipfile.ZipFile(src)
names = [n for n in zin.namelist() if not n.endswith('/')]
names.sort(key=lambda n: (n != '[Content_Types].xml',))
with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zout:
    for n in names:
        data = zin.read(n)
        if n == 'ppt/presentation.xml':
            # notesMasterIdLst must precede sldIdLst per the PresentationML schema;
            # pptxgenjs emits it after, which makes PowerPoint reject the file.
            import re
            xml = data.decode('utf-8')
            m = re.search(r'<p:notesMasterIdLst>.*?</p:notesMasterIdLst>', xml)
            if m and xml.index('<p:sldIdLst>') < m.start():
                block = m.group(0)
                xml = xml.replace(block, '')
                xml = xml.replace('<p:sldIdLst>', block + '<p:sldIdLst>')
                data = xml.encode('utf-8')
        zout.writestr(n, data)
zin.close()
print('repacked', dst)
`;

execFileSync("python3", ["-c", py, input, output], { stdio: "inherit" });
