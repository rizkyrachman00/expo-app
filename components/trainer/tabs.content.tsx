import React from "react";
import PersonalTrainerList from "@/components/trainer/pt.list";
import GymPartnerList from "@/components/trainer/gym.partner.list";

interface TabsContentProps {
  activeTab: string;
}

export default function TabsContent({ activeTab }: TabsContentProps) {
  if (activeTab === "personal-trainer") return <PersonalTrainerList />;
  if (activeTab === "teman-gym") return <GymPartnerList />;
  return null;
}
