import React from 'react'
import { Home, Users, BookOpen, Bell, BarChart2 } from 'lucide-react'

export default function AdminSidebar({ activeTab, setActiveTab }){
  const buttonClass = (tabName) => `flex items-center gap-3 px-4 py-2 rounded cursor-pointer transition-colors ${
    activeTab === tabName 
      ? 'bg-gray-100 dark:bg-slate-800 font-semibold text-udck-primary'
      : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
  }`
  
  return (
    <aside className="w-64 hidden md:block">
      <div className="h-full sticky top-4">
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={buttonClass('dashboard')}><Home size={16}/> Dashboard</button>
          <div className="mt-4 px-3 text-xs text-gray-500">Quản lý tài khoản</div>
          <button onClick={() => setActiveTab('teachers')} className={buttonClass('teachers')}><Users size={16}/> Giảng viên</button>
          <button onClick={() => setActiveTab('students')} className={buttonClass('students')}><Users size={16}/> Sinh viên</button>
          <button onClick={() => setActiveTab('departments')} className={buttonClass('departments')}><BookOpen size={16}/> Khoa</button>
          <button onClick={() => setActiveTab('majors')} className={buttonClass('majors')}><BookOpen size={16}/> Ngành</button>
          <div className="mt-4 px-3 text-xs text-gray-500">Thông tin & báo cáo</div>
          <button onClick={() => setActiveTab('notifications')} className={buttonClass('notifications')}><Bell size={16}/> Thông báo</button>
          <button onClick={() => setActiveTab('reports')} className={buttonClass('reports')}><BarChart2 size={16}/> Báo cáo</button>
        </nav>
      </div>
    </aside>
  )
}
