import {Mail, Phone, Facebook} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-headerbg border-2 border-borderHeader rounded-sm p-4 my-1.5">
      <div className="mx-auto text-textHeader">
        <p>&copy; TuanDakLak 2025</p>
        <div className="flex justify-evenly">
          <p className="ml-10"> Contact: 0853223225</p>
          <p className="ml-25">Email: quangtuanxml@gmail.com</p>
          <p>Facebook: https://www.facebook.com/IamC1508</p>
        </div>
      </div>
    </footer>
  );
}
