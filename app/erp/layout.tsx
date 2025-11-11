import SideBar from "./SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gradient-to-t from-purple-500 via-blue-500 to-black/60">
      <SideBar />
      <main className="flex-1 p-8 h-screen">
        <div className="bg-white/10 rounded-lg p-6 shadow-lg h-full text-white">
          {children}
        </div>
      </main>
    </div>
  );
}
