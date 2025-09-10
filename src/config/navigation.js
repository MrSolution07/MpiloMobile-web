import {
  Calendar,
  Users,
  Stethoscope,
  UserCircle,
  LayoutDashboard,
  MessageCircle,
  FileText,
  ClipboardList,
  Info,
} from "lucide-react";

export const NAV_ITEMS = {
  // admin: [
  //   { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  //   { title: "Doctors", url: "/admin/doctors", icon: Stethoscope },
  //   { title: "Patients", url: "/admin/patients", icon: Users },
  //   { title: "Messages", url: "/admin/messages", icon: MessageCircle },
  //   { title: "Records", url: "/admin/records", icon: FileText },
  // ],
  // doctor: [
  //   { title: "Dashboard", url: "/doctor", icon: LayoutDashboard },
  //   { title: "Appointments", url: "/doctor/appointments", icon: Calendar },
  //   { title: "Messages", url: "/doctor/messages", icon: MessageCircle },
  //   { title: "Profile", url: "/doctor/profile", icon: UserCircle },
  // ],
  // patient: [
  //   { title: "Dashboard", url: "/patient", icon: LayoutDashboard },
  //   // { title: "My Doctors", url: "/patient/doctors", icon: Stethoscope },
  //   { title: "Appointments", url: "/patient/appointments", icon: Calendar },
  //   { title: "Messages", url: "/patient/messages", icon: MessageCircle },
  //   { title: "Records", url: "/patient/records", icon: ClipboardList },
  // ],
  public: [
    { title: "About Us", url: "/about" },
    { title: "Services", url: "/services" },
    { title: "Our Clients", url: "/clients" },
    { title: "Gallery", url: "/gallery" },
  ],
};
