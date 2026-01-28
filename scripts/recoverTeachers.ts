/**
 * Teacher Account Recovery Script
 * Recreates teacher accounts from Brevo export with names and join dates.
 */

import { PrismaClient, TeacherRole, TeacherSubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

// Teacher data from Brevo export: EMAIL;LASTNAME;FIRSTNAME;ADDED_TIME
const TEACHERS = [
  { email: 'support@orbitlearn.app', lastName: 'Jadallah', firstName: 'Saleem', joinDate: '16-12-2025' },
  { email: 'alejandra.tagle@aflec-fr.org', lastName: 'Tagle', firstName: 'Alejandra', joinDate: '28-12-2025' },
  { email: 'gregoryw@diadubai.com', lastName: 'Weldon', firstName: 'Greg', joinDate: '28-12-2025' },
  { email: 'mmohammed@deiraprivateschool.ae', lastName: 'Mohammed', firstName: 'NP Mehjabin', joinDate: '28-12-2025' },
  { email: 'samantha.paul@sheffield-school.com', lastName: 'Paul', firstName: 'Samantha', joinDate: '28-12-2025' },
  { email: 'sangeeta.s_nms@gemsedu.com', lastName: 'Saini', firstName: 'Sangeeta', joinDate: '28-12-2025' },
  { email: 'shreejal@tcsidxb.ae', lastName: 'Suvarna', firstName: 'shreejal', joinDate: '28-12-2025' },
  { email: 'mbnhgk3754@gmail.com', lastName: 'آدام', firstName: 'محمد', joinDate: '29-12-2025' },
  { email: 'salimsafi56503@gmail.com', lastName: 'Safi', firstName: 'Salim', joinDate: '29-12-2025' },
  { email: 'abdallahchebaro@gmail.com', lastName: 'Chbaro', firstName: 'Abdalla', joinDate: '29-12-2025' },
  { email: 'salah.homework@gmail.com', lastName: 'Farag', firstName: 'Salah', joinDate: '30-12-2025' },
  { email: 'tpfaris123@gmail.com', lastName: '', firstName: 'faris', joinDate: '31-12-2025' },
  { email: 'mantonie2@gmail.com', lastName: 'Antonie', firstName: 'Megan', joinDate: '01-01-2026' },
  { email: 'mehrfaisal722@gmail.com', lastName: 'Faisal', firstName: 'Mehreen', joinDate: '04-01-2026' },
  { email: 'nazneenkoya@gmail.com', lastName: 'Anees', firstName: 'Nazneen', joinDate: '10-01-2026' },
  { email: 'nawazfarooq332@gmail.com', lastName: 'NAWAZ', firstName: 'FAROOQ', joinDate: '12-01-2026' },
  { email: 'support@chroma-closet.com', lastName: 'jadallah', firstName: 'saleem', joinDate: '16-01-2026' },
  { email: 'jibreel.maha@gmail.com', lastName: 'Jibreel', firstName: 'Maha', joinDate: '16-01-2026' },
  { email: 'malswdany@as.edu.sa', lastName: 'صابر', firstName: 'محمد', joinDate: '16-01-2026' },
  { email: 'furqan_253@yahoo.co.uk', lastName: 'Aslam', firstName: 'Furqan', joinDate: '16-01-2026' },
  { email: 'sehamalfheed3@gmsil.com', lastName: 'Alfheed', firstName: 'Seham', joinDate: '16-01-2026' },
  { email: 'diaatawfik4101@gmail.com', lastName: 'Ahmed', firstName: 'Diaa eldeen Ibrahem', joinDate: '16-01-2026' },
  { email: 'hamada_na2003@yahoo.com', lastName: 'Ahmed', firstName: 'Ahmed', joinDate: '17-01-2026' },
  { email: 'engrsatukumarbarua@gmail.com', lastName: 'Barua', firstName: 'Satu Kumar', joinDate: '17-01-2026' },
  { email: 'abumazenaa5@gmail.com', lastName: 'Alpopac', firstName: 'Abdulkareem', joinDate: '17-01-2026' },
  { email: 'mhmdsydasy@gmail.com', lastName: 'ASY', firstName: 'MHMD SYD', joinDate: '17-01-2026' },
  { email: 'ahmedhassabulla.65@gmail.com', lastName: 'Hassabulla', firstName: 'Ahmed', joinDate: '17-01-2026' },
  { email: 'ramy1310ramy@gmail.com', lastName: 'Moris', firstName: 'Mr. Ramy', joinDate: '17-01-2026' },
  { email: 'saharriz660@gmail.com', lastName: 'Rizwan', firstName: 'Sahar', joinDate: '17-01-2026' },
  { email: 'lawrencejannie@gmail.com', lastName: 'JANE', firstName: 'LAWRENCE', joinDate: '17-01-2026' },
  { email: 'jfshellayumul@yahoo.com', lastName: 'Valencia', firstName: 'Maricel', joinDate: '17-01-2026' },
  { email: 'hosnielbaz2005@gmail.com', lastName: 'Mohamed', firstName: 'Hosni', joinDate: '17-01-2026' },
  { email: 'mhahane.121022@gmail.com', lastName: 'Talandron', firstName: 'Hendrina', joinDate: '17-01-2026' },
  { email: 'tahmedj28@yahoo.com', lastName: 'Mukhtar', firstName: 'Ahmed', joinDate: '17-01-2026' },
  { email: 'rajitha.k.satheesh.09@gmail.com', lastName: 'Satheesh', firstName: 'Rajitha', joinDate: '18-01-2026' },
  { email: 'antonellanash@gmail.com', lastName: 'nash', firstName: 'antonella', joinDate: '18-01-2026' },
  { email: 'jamshidalikhan3764@gmail.com', lastName: 'Khan', firstName: 'Jamshid', joinDate: '18-01-2026' },
  { email: 'ibrahim.thabet86@gmail.com', lastName: 'Thabet', firstName: 'Ibrahim', joinDate: '18-01-2026' },
  { email: 'samerouf222@gmail.com', lastName: '', firstName: 'Rabeea', joinDate: '18-01-2026' },
  { email: 'jcmangan@gmail.com', lastName: 'Mangan', firstName: 'Jean Claude', joinDate: '18-01-2026' },
  { email: 'olakayyali77@gmail.com', lastName: 'Kayyali', firstName: 'Ola', joinDate: '18-01-2026' },
  { email: 'naderfarouqi@gmail.com', lastName: 'Faro', firstName: 'Nader', joinDate: '19-01-2026' },
  { email: 'nafeesmohammad664@gmail.com', lastName: 'nafees', firstName: 'Mohammad', joinDate: '19-01-2026' },
  { email: 'awaw83740@gmail.com', lastName: 'አባተ', firstName: 'ሀብል', joinDate: '19-01-2026' },
  { email: 'm.m.jadallah91@gmail.com', lastName: 'Jadallah', firstName: 'Mohammad Maher', joinDate: '19-01-2026' },
  { email: 'shebishemi03@gmail.com', lastName: 'Shemeer', firstName: 'Shebeena', joinDate: '19-01-2026' },
  { email: 'umlumya@hotmail.com', lastName: 'Khan', firstName: 'Sadaf', joinDate: '20-01-2026' },
  { email: 'brianbrightmam@gmail.com', lastName: 'Brian', firstName: 'Nkaisyaku', joinDate: '20-01-2026' },
  { email: 'ayyubnatha1970@gmail.com', lastName: 'NATHA', firstName: 'AYYUB', joinDate: '20-01-2026' },
  { email: 'naimjoz@yahoo.com', lastName: 'Joz', firstName: 'Nadia', joinDate: '20-01-2026' },
  { email: 'shakargarhian@yahoo.com', lastName: 'LATIF', firstName: 'SAJID', joinDate: '20-01-2026' },
  { email: 'jasmine.advincula0508@hotmail.com', lastName: 'Advincula', firstName: 'Jasmine', joinDate: '20-01-2026' },
  { email: 'abeersghanem@gmail.com', lastName: 'Ghanem', firstName: 'Abeer', joinDate: '20-01-2026' },
  { email: 'syedahuma122@gmail.com', lastName: 'Syeda', firstName: 'Huma', joinDate: '20-01-2026' },
  { email: 'abusalih17@gmail.com', lastName: 'Ahmed', firstName: 'Haris', joinDate: '20-01-2026' },
  { email: 'aliyapibrahim@gmail.com', lastName: 'SHAHEEN', firstName: 'ALIYA', joinDate: '20-01-2026' },
  { email: 'nakkathfathima@nimsshj.com', lastName: 'Fathima', firstName: 'Nakkath', joinDate: '20-01-2026' },
  { email: 'stephen.onwurah@moe.sch.ae', lastName: 'Onwurah', firstName: 'Stephen', joinDate: '20-01-2026' },
  { email: 'cthafadzah@yahoo.com', lastName: 'Abdul Karim', firstName: 'Siti Hafadzah', joinDate: '21-01-2026' },
  { email: 'veenakiaan05@gmail.com', lastName: 'Mulani', firstName: 'Veena', joinDate: '21-01-2026' },
  { email: 'saadmahid796@gmail.com', lastName: 'Mahid', firstName: 'Saad', joinDate: '21-01-2026' },
  { email: '77anjun@gmail.com', lastName: 'Ahmad', firstName: 'Muhammad', joinDate: '21-01-2026' },
  { email: 'elghazzijihane6@gmail.com', lastName: 'El Ghazzi', firstName: 'jihane', joinDate: '21-01-2026' },
  { email: 'mahmoudosman037@gmail.com', lastName: 'Osman', firstName: 'Mahmoud', joinDate: '21-01-2026' },
  { email: 'enecioannjaneth@gmail.com', lastName: 'Enecio', firstName: 'Ann', joinDate: '21-01-2026' },
  { email: 'nour2532008@gmail.com', lastName: 'صارو', firstName: 'محمد', joinDate: '21-01-2026' },
  { email: 'gehadhoor2@gmail.com', lastName: 'Hoor', firstName: 'Gehad', joinDate: '21-01-2026' },
  { email: 'naveed414@gmail.com', lastName: 'Awan', firstName: 'Muhammad Naveed', joinDate: '22-01-2026' },
  { email: 'mustafa.taher034@gmail.com', lastName: 'Taher', firstName: 'Mustafa', joinDate: '22-01-2026' },
  { email: 'renatodicdican@gmail.com', lastName: 'Donal Dicdican', firstName: 'Renato', joinDate: '22-01-2026' },
  { email: 'ckguseliza@gmail.com', lastName: 'HAMZAH', firstName: 'CIKGU ROSELIZA', joinDate: '22-01-2026' },
  { email: 'shebhsjshs@gmail.com', lastName: 'islam', firstName: 'azharul', joinDate: '22-01-2026' },
  { email: 'juliehana.jo@gmail.com', lastName: 'OTHMAN', firstName: 'JULIHANA', joinDate: '22-01-2026' },
  { email: 'hajirashakeel16@gmail.com', lastName: 'Masroor', firstName: 'Hajira', joinDate: '22-01-2026' },
  { email: 'diana1010@edidik.edu.my', lastName: 'Nuraimee Sapawi', firstName: 'Diana', joinDate: '22-01-2026' },
  { email: 'salmaabuzied81@gmail.com', lastName: 'Abuzied', firstName: 'Salma', joinDate: '22-01-2026' },
  { email: 'azurahanim@upm.edu.my', lastName: 'Azurahanim', firstName: 'Che', joinDate: '22-01-2026' },
  { email: 'aliai81179@gmail.com', lastName: 'Idris', firstName: 'Ali', joinDate: '22-01-2026' },
  { email: 'ahmedhusseiny85@gmail.com', lastName: 'منتصر', firstName: 'احمد', joinDate: '22-01-2026' },
  { email: 'g-58409573@moe-dl.edu.my', lastName: 'KPM-Guru', firstName: 'MHARIAMAH A/P RAMU', joinDate: '22-01-2026' },
  { email: 'simatchap@gmail.com', lastName: 'machap', firstName: 'sivam', joinDate: '22-01-2026' },
  { email: 'kavithamanoj@hotmail.com', lastName: 'S', firstName: 'Kavitha A', joinDate: '22-01-2026' },
  { email: 'mk.kartini@gmail.com', lastName: 'Md Khalid', firstName: 'Kartini', joinDate: '22-01-2026' },
  { email: 'joannaabigail007@gmail.com', lastName: 'Lazarus', firstName: 'Joanna Abigail', joinDate: '22-01-2026' },
  { email: 'g-19020854@moe-dl.edu.my', lastName: 'KPM-Guru', firstName: 'PRAVEEN NAIDU A/L KALAI SELVEM', joinDate: '22-01-2026' },
  { email: 'matakarap82@gmail.com', lastName: 'Morni', firstName: 'Irwan', joinDate: '22-01-2026' },
  { email: 'meher_ahmed22@yahoo.com', lastName: 'Sultana', firstName: 'Meher', joinDate: '22-01-2026' },
  { email: 'fvisint@gmail.com', lastName: 'INT', firstName: 'fvis', joinDate: '22-01-2026' },
  { email: 'leenalhussaini8@gmail.com', lastName: 'Alhussaini', firstName: 'Leen Mohannad', joinDate: '22-01-2026' },
  { email: 'najlajubara@gmail.com', lastName: 'Mustafa', firstName: 'Najla', joinDate: '22-01-2026' },
  { email: 'ms.dddarlene@gmail.com', lastName: 'Dcruz', firstName: 'Darlene', joinDate: '22-01-2026' },
  { email: 'umyasseen11@gmail.com', lastName: 'Habbani', firstName: 'Sara', joinDate: '22-01-2026' },
  { email: 'nezaar@nobala.edu.sa', lastName: 'الزبير', firstName: 'نزار', joinDate: '22-01-2026' },
  { email: 'ahmedarafat207@gmail.com', lastName: 'عرفات', firstName: 'أحمد', joinDate: '22-01-2026' },
  { email: 'hanna.heejin@gmail.com', lastName: 'Heejin', firstName: 'Hanna', joinDate: '23-01-2026' },
  { email: 'stthabet@ju.edu.sa', lastName: 'Thabet', firstName: 'Samah', joinDate: '23-01-2026' },
  { email: 'g-07271833@moe-dl.edu.my', lastName: 'Fazli', firstName: 'Hafizi', joinDate: '23-01-2026' },
  { email: 'rizzareyesvillegas@gmail.com', lastName: 'Reyes', firstName: 'Rizza', joinDate: '23-01-2026' },
  { email: 'hjamil@eim.ae', lastName: 'Jamil', firstName: 'Hamid', joinDate: '23-01-2026' },
  { email: 'mallikamuthu6212@gmail.com', lastName: 'Muthu', firstName: 'Mallika', joinDate: '23-01-2026' },
  { email: 'ameenafathima97@gmail.com', lastName: 'Fathima', firstName: 'Ameena', joinDate: '23-01-2026' },
  { email: 'bayakad.9696@gmail.com', lastName: 'Kad', firstName: 'Baya', joinDate: '23-01-2026' },
  { email: 'emadmadi6767@gmail.com', lastName: 'Madi', firstName: 'Emad', joinDate: '23-01-2026' },
  { email: 'ralla9@eq.edu.au', lastName: 'Allan', firstName: 'Bec', joinDate: '23-01-2026' },
  { email: 'ayeshabaseer12@gmail.com', lastName: 'Baseer', firstName: 'Ayesha', joinDate: '23-01-2026' },
  { email: 'busybeegeevino@gmail.com', lastName: 'Vinoth', firstName: 'Geetha', joinDate: '23-01-2026' },
  { email: 'smartsprout15@gmail.com', lastName: 'acadamy', firstName: 'smartsprout', joinDate: '23-01-2026' },
  { email: 'fadsdoniel@hotmail.co.uk', lastName: 'Fadzi', firstName: 'Fadzi', joinDate: '23-01-2026' },
  { email: 'htaakn@gmail.com', lastName: 'Wong', firstName: 'Gareth', joinDate: '23-01-2026' },
  { email: 'mustafamar68@gmail.com', lastName: 'Mohammed', firstName: 'Mustafa', joinDate: '23-01-2026' },
  { email: 'nashwa.mahmud@gmail.com', lastName: 'Mahmoud', firstName: 'Nashwa', joinDate: '23-01-2026' },
  { email: 'emanuelalepuri12@gmail.com', lastName: 'Lepri', firstName: 'Emanuela', joinDate: '23-01-2026' },
  { email: 'fvkbt0047@mail.mwahib.edu.sa', lastName: 'Abdelkarim', firstName: 'Mohamed', joinDate: '23-01-2026' },
  { email: 'frenz_sharanya@yahoo.com', lastName: 'Ravikumar', firstName: 'Sharanya', joinDate: '23-01-2026' },
  { email: 'raziamuhammadbio@gmail.com', lastName: 'Razia', firstName: 'Dr', joinDate: '23-01-2026' },
  { email: 'yik.jennifer.yik@gmail.com', lastName: 'Yik', firstName: 'Jennifer', joinDate: '23-01-2026' },
  { email: 'amalabd6130@gmail.com', lastName: 'عبدالله', firstName: 'آمال', joinDate: '23-01-2026' },
  { email: 'zakariabouabd417@gmail.com', lastName: 'GA', firstName: 'Zakariya', joinDate: '23-01-2026' },
  { email: 'fariacat3@gmail.com', lastName: 'yasmeen', firstName: 'Hashi', joinDate: '23-01-2026' },
  { email: 'abdul.sukor@pendidikguru.edu.my', lastName: 'Irfan', firstName: 'Abdul', joinDate: '23-01-2026' },
  { email: 'dina.mohamed@meis.sch.sa', lastName: 'Rabie', firstName: 'dina', joinDate: '23-01-2026' },
  { email: 'anneadil84@gmail.com', lastName: 'Adil', firstName: 'Zainab', joinDate: '23-01-2026' },
  { email: 'ahmedali01118488@gmail.com', lastName: 'Ali', firstName: 'Ahmed', joinDate: '23-01-2026' },
  { email: 'qqasem2008@yahoo.com', lastName: 'qqasem', firstName: 'ibrahem', joinDate: '23-01-2026' },
  { email: 'cgnoh3@gmail.com', lastName: 'Noh', firstName: 'Cg', joinDate: '23-01-2026' },
  { email: 'josianejad@gmail.com', lastName: 'Jad', firstName: 'Josiane', joinDate: '23-01-2026' },
  { email: 's.mahmood1882@gmail.com', lastName: 'khalid', firstName: 'Saima', joinDate: '23-01-2026' },
  { email: 'ayat.abdullah@msc.edu.sa', lastName: 'Abdullah', firstName: 'Ayat', joinDate: '23-01-2026' },
  { email: 'nvmahes@gmail.com', lastName: 'Wary', firstName: 'Mahes', joinDate: '23-01-2026' },
  { email: 'miriamkamau11@gmail.comm', lastName: 'Kamau', firstName: 'Miriam', joinDate: '23-01-2026' },
  { email: 'jescilin@gmail.com', lastName: 'jescilin', firstName: 'sooza', joinDate: '23-01-2026' },
  { email: 'teaailee1978@gmail.com', lastName: 'LEE', firstName: 'AI', joinDate: '24-01-2026' },
  { email: 'selma.rabbani@gmail.com', lastName: 'Rabbani', firstName: 'Salma', joinDate: '24-01-2026' },
  { email: 'mmaklad999@gmail.com', lastName: 'أحمد', firstName: 'Ahmad', joinDate: '24-01-2026' },
  { email: 'mohammad_faizal_b_ismail@moe.edu.sg', lastName: 'Ismail', firstName: 'Mohammad Faizal', joinDate: '24-01-2026' },
  { email: 'daviniajoan@gmail.com', lastName: 'Joan', firstName: 'D', joinDate: '24-01-2026' },
  { email: 'louis@louisenslin.com', lastName: 'Enslin', firstName: 'Louis', joinDate: '24-01-2026' },
  { email: 'pmundingi29@gmail.com', lastName: 'Mundingi', firstName: 'Prosper', joinDate: '24-01-2026' },
  { email: 'carmela.greco604@schools.sa.edu.au', lastName: 'Greco', firstName: 'Carmela', joinDate: '24-01-2026' },
  { email: 'aliatooba@paragon.edu.my', lastName: 'Tooba', firstName: 'Alia', joinDate: '24-01-2026' },
  { email: 'g-00241851@moe-dl.edu.my', lastName: 'Val', firstName: 'Rosario', joinDate: '24-01-2026' },
  { email: 'nurwahidanasir@gmail.com', lastName: 'Wahida', firstName: 'Nur', joinDate: '24-01-2026' },
  { email: 'gamal.bekheet77@gmail.com', lastName: 'Elsayed', firstName: 'Gamal', joinDate: '24-01-2026' },
  { email: 'yelswerky@gmail.com', lastName: 'Abd Elazez', firstName: 'Yasser', joinDate: '24-01-2026' },
  { email: 'sasikala.vivekanandan-smf@smgeducation.org', lastName: 'Vivekanandan', firstName: 'Sasikala', joinDate: '24-01-2026' },
  { email: 'ceciliakmasalamoney@gmail.com', lastName: 'K. Masalamoney', firstName: 'Cecilia', joinDate: '24-01-2026' },
  { email: 'lili.lolla92@gmail.com', lastName: 'KHALED', firstName: 'LAILA', joinDate: '24-01-2026' },
  { email: 'rafat.naaz500@gmail.com', lastName: 'Pathan', firstName: 'Rafatnaaz', joinDate: '24-01-2026' },
  { email: 'musa139698@gmail.com', lastName: 'Kleibi', firstName: 'Musa', joinDate: '24-01-2026' },
  { email: 'nisha3184@gmail.com', lastName: 'Nair', firstName: 'Nimmi', joinDate: '24-01-2026' },
  { email: 'asmaghulam01@gmail.com', lastName: 'ghulam', firstName: 'Asma', joinDate: '24-01-2026' },
  { email: 'a.fathimahassan@gmail.com', lastName: 'Abul Hassan', firstName: 'Fathima Hassan', joinDate: '24-01-2026' },
  { email: 'mmkh.iat@gmail.com', lastName: 'Habash', firstName: 'Muhammad', joinDate: '24-01-2026' },
  { email: 'karthikashabu87@gmail.com', lastName: 'Shabu', firstName: 'Karthika', joinDate: '24-01-2026' },
  { email: 'queensesarrapalumar004@gmail.com', lastName: 'Palumar', firstName: 'Queen Sesarra A.', joinDate: '24-01-2026' },
  { email: 'nurraihan843@gmail.com', lastName: 'Raihan', firstName: 'Nur', joinDate: '24-01-2026' },
  { email: 'arnazparakh@yahoo.com', lastName: 'Mirza', firstName: 'Arnaz', joinDate: '24-01-2026' },
  { email: 'astecrylriego@gmail.com', lastName: 'Riego', firstName: 'Astecryl', joinDate: '24-01-2026' },
  { email: 'g-94522197@moe-dl.edu.my', lastName: 'Bakri', firstName: 'Norliza', joinDate: '24-01-2026' },
  { email: 'sumayameeram@gmail.com', lastName: 'Meera', firstName: 'Sumaya', joinDate: '24-01-2026' },
  { email: 'noornazleena@gmail.com', lastName: 'Zahir', firstName: 'Noornazleena', joinDate: '24-01-2026' },
  { email: 'noshiya.asif@gmail.com', lastName: 'Asif', firstName: 'Noshiya', joinDate: '24-01-2026' },
  { email: 'michelle.fabian47@gmail.com', lastName: 'Gomez', firstName: 'Michelle', joinDate: '24-01-2026' },
  { email: 'ummealiasger@gmail.com', lastName: 'Ali', firstName: 'Shaheena', joinDate: '24-01-2026' },
  { email: 'mahra.s.m97@hotmail.com', lastName: 'AlBlooshi', firstName: 'Mahra', joinDate: '24-01-2026' },
  { email: 'adziahaziz@gmail.com', lastName: 'AbdAziz', firstName: 'Aulia', joinDate: '24-01-2026' },
  { email: 'mariamanzoor1987@gmail.com', lastName: 'Manzoor', firstName: 'Maria', joinDate: '24-01-2026' },
  { email: 'dhenvaldez123@gmail.com', lastName: 'Jenardin A.', firstName: 'VALDEZ,', joinDate: '24-01-2026' },
  { email: 'mariasriintanpurnama@gmail.com', lastName: 'Sri Intan Purnama', firstName: 'Maria', joinDate: '24-01-2026' },
  { email: 'a.daligdig@me.com', lastName: 'D', firstName: 'Anya', joinDate: '24-01-2026' },
  { email: 'classteacher6b@sisad.org', lastName: '6b', firstName: 'classteacher', joinDate: '24-01-2026' },
  { email: 'raghda.hbaili@gis.sch.sa', lastName: 'Hbaili', firstName: 'Raghda', joinDate: '24-01-2026' },
  { email: 'ashoarah@gmail.com', lastName: 'Alshoarah', firstName: 'Alaa', joinDate: '24-01-2026' },
  { email: 'ashrafirfan39@gmail.com', lastName: 'Ashraf', firstName: 'Irfan', joinDate: '24-01-2026' },
  { email: 'rosarynhong@gmail.com', lastName: 'Rose Hong', firstName: 'Rose', joinDate: '24-01-2026' },
  { email: 'mollysoignee@gmail.com', lastName: 's', firstName: 'molly', joinDate: '24-01-2026' },
  { email: 'seena.saji-smf@smgeducation.org', lastName: 'Saji', firstName: 'Seena', joinDate: '24-01-2026' },
  { email: 'mariamasim.2010@gmail.com', lastName: 'Asim', firstName: 'Mariam', joinDate: '24-01-2026' },
  { email: 'sangeetha.divakaran@amag.com.qa', lastName: 'Divakaran', firstName: 'Sangeetha', joinDate: '24-01-2026' },
  { email: 'sajjadakbarroy@gmail.com', lastName: 'Akbar', firstName: 'Sajjad', joinDate: '24-01-2026' },
  { email: 'sabina.mulla078@gmail.com', lastName: 'Mulla', firstName: 'Sabina', joinDate: '24-01-2026' },
  { email: 'sana.abqadi@gmail.com', lastName: 'Ansari', firstName: 'Sana', joinDate: '24-01-2026' },
  { email: 'sumaiyafarooq24@gmail.com', lastName: 'farooq', firstName: 'sumaiya', joinDate: '24-01-2026' },
  { email: 'rozniasara@gmail.com', lastName: 'Aboobakker', firstName: 'Roznia', joinDate: '24-01-2026' },
  { email: 'hafiyhadif13@gmail.com', lastName: 'Mohd', firstName: 'Norhasliza', joinDate: '25-01-2026' },
  { email: 'shahul@migs.edu.my', lastName: 'Hameed', firstName: 'Shahul', joinDate: '25-01-2026' },
  { email: 'angelicagarnoza@gmail.com', lastName: 'Garnoza', firstName: 'Angelica', joinDate: '25-01-2026' },
  { email: 'barzat.nawaiseh@gmail.com', lastName: 'A.N', firstName: 'Barzat', joinDate: '25-01-2026' },
  { email: 'faizal@merituscollege.edu.my', lastName: 'Mustafa', firstName: 'Faizal', joinDate: '25-01-2026' },
  { email: 'christobrand.cb@gmail.com', lastName: 'Brand', firstName: 'Christo', joinDate: '25-01-2026' },
  { email: 'alexmok5753@gmail.com', lastName: 'Mok', firstName: 'Alex', joinDate: '25-01-2026' },
  { email: 'rafael_michelle29@yahoo.com', lastName: 'Rafael', firstName: 'Michelle', joinDate: '25-01-2026' },
  { email: 'amelboukhris74@gmail.com', lastName: 'Boukhris', firstName: 'Amel', joinDate: '25-01-2026' },
  { email: 'maryamalhebsi15@gmail.com', lastName: 'ALHEBSI15', firstName: 'MARYAM', joinDate: '25-01-2026' },
  { email: 'noysembrano@gmail.com', lastName: 'Benigno', firstName: 'Sembrano', joinDate: '25-01-2026' },
  { email: 'harpreetkaur.narindarpalsingh@qiu.edu.my', lastName: 'Narindar Pal Singh (FSS)', firstName: 'Harpreet Kaur', joinDate: '25-01-2026' },
  { email: 'tsitsikandemwa4@gmail.com', lastName: 'kandemwa', firstName: 'tsitsi', joinDate: '25-01-2026' },
  { email: 'savalavicky2@gmail.com', lastName: 'Fru', firstName: 'Victorine', joinDate: '25-01-2026' },
  { email: 'sivam198706@gmail.com', lastName: 'M', firstName: 'SivaPrasad', joinDate: '25-01-2026' },
  { email: 'sujeshradhikaparu@gmail.com', lastName: 'sujesh', firstName: 'radhika', joinDate: '25-01-2026' },
  { email: 'dr.geethusudheesh@gmail.com', lastName: 'Sudheesh', firstName: 'Geethu', joinDate: '25-01-2026' },
  { email: 'rozelledevera20@gmail.com', lastName: 'De Vera', firstName: 'Rozelle', joinDate: '25-01-2026' },
  { email: 'mamdouh.fa@gmail.com', lastName: 'Fathy', firstName: 'Mamdouh', joinDate: '25-01-2026' },
  { email: 'zarinazamrina@gmail.com', lastName: 'ZARINA', firstName: 'SITI', joinDate: '25-01-2026' },
  { email: 'saba1427@gmail.com', lastName: 'hassan', firstName: 'Saba', joinDate: '25-01-2026' },
  { email: 'hqdaih@kfs.sch.sa', lastName: 'Qdaih', firstName: 'Hala', joinDate: '25-01-2026' },
  { email: 'cristinabucoy@gmail.com', lastName: 'Locson Bucoy', firstName: 'Maria Cristina', joinDate: '25-01-2026' },
  { email: 'iftikhar74khan@gmail.com', lastName: 'Khan', firstName: 'Iftikhar', joinDate: '25-01-2026' },
  { email: 'sirsaharudin@gmail.com', lastName: 'Rudin', firstName: 'Saha', joinDate: '25-01-2026' },
  { email: 'hakimiayman83@gmail.com', lastName: 'ayman', firstName: 'hakimi', joinDate: '25-01-2026' },
  { email: 'johnlaurincerapirap@gmail.com', lastName: 'JOHN LAURENCE', firstName: 'RAPIRAP', joinDate: '25-01-2026' },
  { email: 'fazleenhabeebah96@gmail.com', lastName: 'Habeebah', firstName: 'Fazleen', joinDate: '25-01-2026' },
  { email: 'roshinimohan0903@gmail.com', lastName: 'Mohan', firstName: 'Roshini', joinDate: '25-01-2026' },
  { email: 'sherrintsang0@gmail.com', lastName: 'Tsang', firstName: 'Sherrin', joinDate: '25-01-2026' },
  { email: 'rumaizah.m@gardenschool.edu.my', lastName: 'Mohd Jailani', firstName: 'Rumaizah', joinDate: '25-01-2026' },
  { email: 'teclingsapphire23@gmail.com', lastName: 'Tecling', firstName: 'Sapphire', joinDate: '25-01-2026' },
  { email: 'ms.gohar123pss@gmail.com', lastName: 'Gohar', firstName: 'Ms', joinDate: '25-01-2026' },
  { email: 'saonashri2@gmail.com', lastName: 'Nashri', firstName: 'Suliman', joinDate: '25-01-2026' },
  { email: 'ganeshyadav980310121@gmail.com', lastName: 'Yadav', firstName: 'Ganesh', joinDate: '26-01-2026' },
];

function parseDate(dateStr: string): Date {
  // Format: DD-MM-YYYY
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

async function main() {
  console.log('🔄 Teacher Account Recovery Script\n');
  console.log(`📧 Processing ${TEACHERS.length} teacher(s)...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const teacher of TEACHERS) {
    const normalizedEmail = teacher.email.toLowerCase().trim();

    try {
      // Check if already exists
      const existing = await prisma.teacher.findUnique({
        where: { email: normalizedEmail },
      });

      if (existing) {
        console.log(`⏭️  Already exists: ${normalizedEmail}`);
        skipped++;
        continue;
      }

      const joinDate = parseDate(teacher.joinDate);

      // Create teacher with mustSetPassword flag
      await prisma.teacher.create({
        data: {
          email: normalizedEmail,
          firstName: teacher.firstName || null,
          lastName: teacher.lastName || null,
          passwordHash: null, // No password - will be set on first login
          mustSetPassword: true, // First login password becomes permanent
          emailVerified: true,
          role: TeacherRole.TEACHER,
          subscriptionTier: TeacherSubscriptionTier.FREE,
          monthlyTokenQuota: BigInt(30000), // 30K tokens (30 credits)
          currentMonthUsage: BigInt(0),
          quotaResetDate: new Date(),
          createdAt: joinDate,
        },
      });

      console.log(`✅ Created: ${teacher.firstName} ${teacher.lastName} <${normalizedEmail}>`);
      created++;
    } catch (err) {
      console.log(`❌ Error with ${normalizedEmail}: ${err}`);
      errors++;
    }
  }

  console.log('\n========================================');
  console.log('📊 Recovery Summary:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped (already exist): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('========================================\n');

  if (created > 0) {
    console.log('ℹ️  Next steps:');
    console.log('   1. Teachers log in with their email');
    console.log('   2. Whatever password they enter becomes permanent');
    console.log('   3. Normal login flow after that\n');
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
