require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const VEHICLES = [
  { make:'Mahindra', model:'Thar Roxx 4x4',      category:'SUV',     price:1699000, quantity:5, year:2024, vin:'MA1THARROXX2024IN',  imageUrl:'/images/mahindra_thar.jpg',   description:'2.0L Turbo Petrol / 2.2L mHawk Diesel, 174 bhp, 4WD system, Dual Sunroof & ADAS.' },
  { make:'Tata',     model:'Nexon EV Long Range', category:'Electric',price:1449000, quantity:8, year:2024, vin:'TATANEXONEV2024IN',  imageUrl:'/images/tata_nexon_ev.jpg',   description:'45 kWh Battery, 465 km ARAI certified range, V2L & V2V charging technology.' },
  { make:'Mahindra', model:'XUV700 AX7 L',        category:'SUV',     price:2399000, quantity:4, year:2024, vin:'MA1XUV700AX7L2024', imageUrl:'/images/mahindra_xuv700.jpg', description:'2.2L mHawk Diesel AWD, 200 PS power, Panoramic Skyroof & ADAS Level 2.' },
  { make:'Toyota',   model:'Fortuner Legender',   category:'SUV',     price:4360000, quantity:3, year:2024, vin:'TOYFORTLEGEND2024',  imageUrl:'/images/toyota_fortuner.jpg', description:'2.8L Diesel 4x4, 204 PS, 500 Nm torque, premium dual-tone interior.' },
  { make:'Hyundai',  model:'Creta N Line',         category:'SUV',     price:1688000, quantity:6, year:2024, vin:'HYUCRETANLINE2024',  imageUrl:'/images/hyundai_creta.jpg',   description:'1.5L Turbo GDi, 160 PS power, 7-Speed DCT with paddle shifters & N Line tuning.' },
  { make:'Maruti Suzuki', model:'Jimny Alpha 4WD', category:'SUV',    price:1274000, quantity:0, year:2024, vin:'MSJIMNYALPHA2024IN', imageUrl:'/images/maruti_jimny.jpg',    description:'ALLGRIP PRO 4WD system, rigid ladder frame, 1.5L K-series petrol engine.' },
  { make:'BMW',      model:'M340i xDrive',         category:'Luxury',  price:7290000, quantity:2, year:2024, vin:'BMWM340IXDRIVE2024', imageUrl:'/images/bmw_m340i.jpg',       description:'3.0L Straight-6 TwinPower Turbo, 374 bhp, 0-100 km/h in 4.4 seconds.' },
  { make:'Mercedes-Benz', model:'G 63 AMG',        category:'Luxury',  price:33000000,quantity:1, year:2024, vin:'MBG63AMGINDIA2024',  imageUrl:'/images/mercedes_g63.jpg',    description:'Handcrafted AMG 4.0L V8 Biturbo, 585 hp, AMG Performance 4MATIC.' },
  { make:'Kia',      model:'Seltos HTX+ AWD',      category:'SUV',     price:2099000, quantity:7, year:2024, vin:'KIASELTOSHTX2024IN', imageUrl:'/images/mahindra_xuv700.jpg', description:'1.5L Turbo GDi AWD, 160 PS, Bose sound system, Panoramic Sunroof & Level 2 ADAS.' },
  { make:'Tata',     model:'Safari Dark Edition',  category:'SUV',     price:2299000, quantity:3, year:2024, vin:'TATASAFARIDK2024IN', imageUrl:'/images/mahindra_thar.jpg',   description:'2.0L Kryotec Diesel, 170 PS, 7-seater flagship SUV with panoramic sunroof.' },
  { make:'Honda',    model:'City e:HEV Hybrid',    category:'Sedan',   price:1950000, quantity:5, year:2024, vin:'HONDACITYEHEV2024IN',imageUrl:'/images/hyundai_creta.jpg',   description:'1.5L i-MMD Hybrid, 126 PS, 25+ km/L fuel efficiency, ECON & SPORT modes.' },
  { make:'Skoda',    model:'Octavia RS 245',        category:'Sedan',   price:4599000, quantity:2, year:2024, vin:'SKODAOCTRSIN2024IN', imageUrl:'/images/bmw_m340i.jpg',       description:'2.0L TSI, 245 PS, 0-100 km/h in 6.7s, sport chassis & DCC adaptive suspension.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Seed admin
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    await User.create({ username: 'admin', email: 'admin@phvault.in', password: 'admin123', role: 'ROLE_ADMIN' });
    console.log('Admin user created (admin / admin123)');
  } else {
    console.log('Admin already exists');
  }

  // Seed vehicles by VIN
  for (const v of VEHICLES) {
    const exists = await Vehicle.findOne({ vin: v.vin });
    if (!exists) {
      await Vehicle.create(v);
      console.log(`Seeded: ${v.make} ${v.model}`);
    } else {
      console.log(`Already exists: ${v.make} ${v.model}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
