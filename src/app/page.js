import HomeSec1 from "@/components/home/HomeSec1";
import HomeSec2 from "@/components/home/HomeSec2";
import HomeSec3 from "@/components/home/HomeSec3";
import HomeSec4 from "@/components/home/HomeSec4";
import HomeSec5 from "@/components/home/HomeSec5";
import HomeSec6 from "@/components/home/HomeSec6";
import HomeSec7 from "@/components/home/HomeSec7";
import HomeSec8 from "@/components/home/HomeSec8";
import HomeSec9 from "@/components/home/HomeSec9";
import HomeSec10 from "@/components/home/HomeSec10";
import HomeSec11 from "@/components/home/HomeSec11";
import HomeSec12 from "@/components/home/HomeSec12";
import HomeSec13 from "@/components/home/HomeSec13";
import homeSec1Data from "@/data/home/homeSec1.json";
import homeSec2Data from "@/data/home/homeSec2.json";
import homeSec3Data from "@/data/home/homeSec3.json";
import homeSec4Data from "@/data/home/homeSec4.json";
import homeSec5Data from "@/data/home/homeSec5.json";
import homeSec6Data from "@/data/home/homeSec6.json";
import homeSec7Data from "@/data/home/homeSec7.json";
import homeSec8Data from "@/data/home/homeSec8.json";
import homeSec9Data from "@/data/home/homeSec9.json";
import homeSec10Data from "@/data/home/homeSec10.json";
import homeSec11Data from "@/data/home/homeSec11.json";
import homeSec12Data from "@/data/home/homeSec12.json";
import homeSec13Data from "@/data/home/homeSec13.json";

export default function Home() {
  return (
    <main>
      <HomeSec1 data={homeSec1Data} band="page" />
      <HomeSec2 data={homeSec2Data} band="soft" />
      <HomeSec3 data={homeSec3Data} band="page" />
      <HomeSec4 data={homeSec4Data} band="soft" />
      <HomeSec9 data={homeSec9Data} band="page" />
      <HomeSec8 data={homeSec8Data} band="soft" />

      <HomeSec5 data={homeSec5Data} band="page" />

      <HomeSec6 data={homeSec6Data} band="soft" />
      <HomeSec10 data={homeSec10Data} band="page" />

      {/* <HomeSec7 data={homeSec7Data} /> */}
      <HomeSec11 data={homeSec11Data} band="soft" />
      <HomeSec12 data={homeSec12Data} band="page" />
      <HomeSec13 data={homeSec13Data} band="soft" />
    </main>
  );
}
