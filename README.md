# waijaiPDF

โมดูลจัดการไฟล์ PDF แบบครบวงจร ทำงานได้เต็มรูปแบบในฝั่ง client — ไม่ต้องอัปโหลดไฟล์ไปยังเซิร์ฟเวอร์ รองรับการบีบอัด แปลงไฟล์ หมุนหน้า และวิเคราะห์ไฟล์ PDF โดยตรงในเบราว์เซอร์

---

## ฟีเจอร์หลัก

| โมดูล | รายละเอียด |
|-------|------------|
| **Analyze** | วิเคราะห์ไฟล์อัตโนมัติ — จำนวนหน้า ประเภทเนื้อหา (Text / Scanned) และขนาดไฟล์ พร้อมแนะนำ action ที่เหมาะสม |
| **Compress** | บีบอัด PDF ผ่าน quality slider (0–100) พร้อมแสดงขนาดโดยประมาณแบบ real-time ก่อน process |
| **Convert** | แปลงเป็น DOCX, JPG, PNG, TXT หรือ HTML รองรับทั้ง text-based และ scanned PDF |
| **Rotate** | บังคับทุกหน้าให้เป็น Portrait หรือ Landscape โดยหมุนเฉพาะหน้าที่มีทิศทางผิด |
| **Watermark** | ประทับข้อความลงทุกหน้า เลือกข้อความ สี ความโปร่งแสง และทิศทาง (เฉียง/แนวนอน) |

---

## เทคโนโลยี

- **Vite + React 18 + TypeScript** — build toolchain และ UI framework
- **pdf-lib** — สร้าง แก้ไข และ rotate PDF โดยตรง
- **pdfjs-dist** — render หน้า PDF เป็น canvas สำหรับ compress และ analyze
- **docx** — สร้างไฟล์ DOCX จากข้อความที่ดึงออกมา
- **JSZip** — แพ็ก output หลายไฟล์เป็น ZIP เมื่อแปลงหลายหน้า

---

## การติดตั้งและรันโปรเจกต์

ต้องการ **Node.js 22+**

```bash
# ติดตั้ง dependencies
npm install

# เริ่ม dev server ที่ http://localhost:5173
npm run dev

# type-check และ build สำหรับ production
npm run build

# preview production build ในเครื่อง
npm run preview
```

---

## โครงสร้างโปรเจกต์

```
src/
├── App.tsx                  # state machine หลัก — จัดการ screen transitions ทั้งหมด
├── main.tsx                 # entry point
├── index.css                # CSS custom properties, keyframes, global styles
├── types.ts                 # Screen, ActionId, Analysis, ProcessOptions, TweakValues
├── utils.ts                 # fmtSize(), estCompressed()
├── components/
│   ├── Icon.tsx             # SVG icon component รวมทุก icon ไว้ในไฟล์เดียว
│   ├── Nav.tsx
│   ├── DropZone.tsx
│   ├── FileChip.tsx         # แสดงชื่อและขนาดไฟล์แบบ compact
│   ├── StepRow.tsx          # แถบ step indicator แนวนอน
│   ├── Btn.tsx              # primary button
│   ├── CheckRow.tsx         # checkbox พร้อม label
│   └── SettingsModal.tsx
├── screens/
│   ├── HomeScreen.tsx       # drop zone หน้าหลัก
│   ├── AnalyzingScreen.tsx  # กำลังวิเคราะห์ไฟล์
│   ├── AnalysisScreen.tsx   # แสดงผลวิเคราะห์ + เลือก action
│   ├── CompressScreen.tsx   # ตั้งค่า quality slider
│   ├── ConvertScreen.tsx    # เลือก output format
│   ├── RotateScreen.tsx     # เลือก Portrait / Landscape
│   ├── ProcessingScreen.tsx # progress bar ระหว่างประมวลผล
│   └── DownloadScreen.tsx   # แสดงผลลัพธ์และดาวน์โหลด
└── lib/
    └── pdfProcessor.ts      # logic จริง — analyzePDF, compressPDF, convertPDF, rotatePDF
```

---

## Screen Flow

```
home → analyzing → analyzed → compress  → processing → done
                            → convert   → processing → done
                            → rotate    → processing → done
```

ทุกอย่างทำงานใน browser — ไม่มีการส่งไฟล์ออกไปยัง server ใดๆ

---

## การเพิ่ม Module ใหม่

1. เพิ่ม action ในอาร์เรย์ `actions` ของ `AnalysisScreen.tsx`
2. เพิ่ม id ใหม่ใน `Screen` union และ `ActionId` ใน `src/types.ts`
3. เพิ่ม interface `Options` ใน `src/types.ts` และเพิ่มเข้า `ProcessOptions`
4. สร้าง `src/screens/<Name>Screen.tsx` — props: `{ t, file, onSubmit, onBack }`
5. เพิ่ม function process ใน `src/lib/pdfProcessor.ts`
6. Wire ใน `App.tsx` และ `ProcessingScreen.tsx`

---

## ข้อจำกัดปัจจุบัน

- ขนาดไฟล์สูงสุดที่รองรับ: **100 MB**
- การประมาณขนาดหลัง compress เป็นค่าประมาณ ผลลัพธ์จริงขึ้นอยู่กับเนื้อหา PDF
- การแปลง format บางรูปแบบอาจสูญเสียการจัดรูปแบบที่ซับซ้อน
- ประสิทธิภาพขึ้นอยู่กับ hardware ของผู้ใช้ เนื่องจากทุกอย่างทำงานใน browser

---

## แผนพัฒนาในอนาคต

- Batch processing — อัปโหลดและประมวลผลหลายไฟล์พร้อมกัน
- Preview ก่อนดาวน์โหลด
- Watermark และ encryption
- Merge / Split PDF
- ต่อยอดเป็น SaaS platform

---

## License

Private — สงวนลิขสิทธิ์
