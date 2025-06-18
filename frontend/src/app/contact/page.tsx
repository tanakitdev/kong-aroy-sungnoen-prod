export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">ติดต่อเรา</h1>
      <p className="text-gray-700 mb-2">
        หากคุณมีคำถาม ข้อเสนอแนะ หรือสนใจลงโฆษณาในเว็บไซต์ของเรา
        สามารถติดต่อทีมงานได้ที่:
      </p>
      <ul className="list-disc list-inside text-gray-700">
        <li>อีเมล: <a href="mailto:tanakit.dev@gmail.com" className="text-blue-600 underline">tanakit.dev@gmail.com</a></li>
        <li>โทรศัพท์: 094-741-5459</li>
        <li>Facebook Page: <a href="https://www.facebook.com/profile.php?id=61577253848573" target="_blank" className="text-blue-600 underline">Ninja Go</a></li>
      </ul>
    </div>
  );
}
