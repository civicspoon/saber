import InadList from "./Components/InadList";
import InsertInad from "./Components/InsertInad";

function page() {
  return (
    <>
      <div>
        <div >เพิ่มข้อมูล INAD AOTGA</div>
        <div className="flex bg-slate-700 p-4 rounded-lg shadow-black shadow-sm">
          <InsertInad />
        </div>
        <div className="my-2">
          <InadList />
        </div>
      </div>
    </>
  );
}

export default page;