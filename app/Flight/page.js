import InsertInad from "./Components/InsertInad";

function page() {
  return (
    <>
      <div>
        <div >เพิ่มข้อมูล INAD AOTGA</div>
        <div className="flex bg-slate-700 p-4 rounded-lg shadow-black shadow-sm">

          <InsertInad />
        </div>
      </div>
    </>
  );
}

export default page;