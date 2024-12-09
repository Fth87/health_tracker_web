'use client';

import React, { useState } from 'react';
import { Button, CircularProgress, DatePicker, Divider, Input, Link, Select, SelectItem, TimeInput } from '@nextui-org/react';
import { CalendarDate, Time } from '@internationalized/date';
import { MdMan4, MdWoman2 } from 'react-icons/md';
import { IoMdArrowBack } from 'react-icons/io';
import Markdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';

const activityOptions = [
  { id: 1, name: 'Pasif (tidak berolahraga)', multiplier: 1.2 },
  { id: 2, name: 'Ringan (berolahraga ringan 1-3 kali seminggu)', multiplier: 1.375 },
  { id: 3, name: 'Sedang (berolahraga sedang 3-5 kali seminggu)', multiplier: 1.55 },
  { id: 4, name: 'Berat (berolahraga berat 6-7 kali seminggu)', multiplier: 1.725 },
  { id: 5, name: 'Sangat berat (berolahraga berat setiap hari)', multiplier: 1.9 },
];

const Page: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date(),
    gender: '',
    height: '',
    weight: '',
    water: '',
    activity: 1,
    sleepStart: new Time(),
    sleepEnd: new Time(),
  });

  const [submit, setSubmit] = useState(false);
  const [bmiValue, setBmiValue] = useState(0);
  const [gemini, setGemini] = useState('');

  const age = new Date().getFullYear() - formData.date.getFullYear();
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
  }
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const runAI = async () => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([prompt]);
    setGemini(result.response.text());
  };

  const calculateBmr = () => {
    const weight = Number(formData.weight);
    const height = Number(formData.height);
    return formData.gender === 'laki-laki' ? 66 + 13.7 * weight + 5 * height - 6.8 * age : 665 + 9.6 * weight + 1.8 * height - 4.7 * age;
  };

  const calculateTdee = () => {
    const activity = activityOptions.find((a) => a.id === formData.activity)?.multiplier || 1.2;
    return calculateBmr() * activity;
  };

  const calculateBmi = (): number => {
    const weight = Number(formData.weight);
    const height = Number(formData.height);
    return weight / Math.pow(height / 100, 2);
  };

  const calculateSleepDuration = () => {
    const start = new Date();
    start.setHours(formData.sleepStart.hour, formData.sleepStart.minute, 0, 0);
    const end = new Date();
    end.setHours(formData.sleepEnd.hour, formData.sleepEnd.minute, 0, 0);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return duration < 0 ? duration + 24 : duration;
  };

  const calculateWater = () => Number(formData.weight) * 35;

  const getBmiStatusColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-yellow-200';
    if (bmi <= 24.9) return 'text-green-400';
    if (bmi <= 29.9) return 'text-yellow-200';
    if (bmi <= 39.9) return 'text-red-300';
    return 'text-red-500';
  };

  interface FormData {
    date: Date;
    gender: string;
    height: string;
    weight: string;
    water: string;
    activity: number;
    sleepStart: Time;
    sleepEnd: Time;
  }

  const handleChange = (field: keyof FormData, value: string | number | Date | Time): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmit(true);
    runAI();
    setBmiValue(calculateBmi());
    console.log({
      BMR: calculateBmr().toFixed(2),
      BMI: calculateBmi().toFixed(2),
      TDEE: calculateTdee().toFixed(2),
      Sleep_Duration: calculateSleepDuration().toFixed(),
      Water_recommendation: calculateWater(),
    },formData);
  };

  const data = {
    BMR: calculateBmr().toFixed(2),
    BMI: calculateBmi().toFixed(2),
    TDEE: calculateTdee().toFixed(2),
    Sleep_Duration: calculateSleepDuration().toFixed(),
    Water_recommendation: calculateWater(),
  };

  const prompt = `
  Berikut adalah data kesehatan pengguna:
  - Berat badan: ${formData.weight} kg
  - Tinggi badan: ${formData.height} cm
  - Usia: ${age} tahun
  - Jenis kelamin: ${formData.gender}
  - Durasi tidur: ${calculateSleepDuration()} jam
  - BMI: ${calculateBmi().toFixed(2)}
  - BMR: ${calculateBmr().toFixed(2)}
  - TDEE: ${calculateTdee().toFixed(2)}
  - Air minum: ${formData.water} ml


  Berdasarkan data ini:
  1. Prediksi risiko kesehatan seperti obesitas, diabetes, atau tekanan darah tinggi dan masalah kesehatan lainnya, jelaskan selengkap mungkin.
  2. Identifikasi kebiasaan tidak sehat, seperti pola tidur yang kurang.
  3. Berikan saran perubahan kebiasaan kecil yang dapat berdampak besar.

  Tampilkan analisis lengkap dan detail.
  `;

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
      <Link href="/" className="self-start ml-6">
        <IoMdArrowBack className="w-6 h-6 text-white" />
      </Link>
      <div className="inline-block max-w-xl text-center">
        <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">Cek </span>
        <span className="text-4xl font-bold text-violet-800 dark:text-violet-500">Kesehatan </span>
        <div className="text-lg mt-4 text-neutraArjunal-800 dark:text-neutral-200">Cek Kesehatanmu dan dapatkan saran dari kami</div>
      </div>
      <div className="w-full px-6 mt-4">
        <form onSubmit={handleSubmit}>
          <div className="gap-6 flex flex-col md:grid md:grid-cols-3">
            <DatePicker showMonthAndYearPickers isRequired onChange={(date) => handleChange('date', new Date(date.year, date.month - 1, date.day))} label="Tanggal lahir" placeholderValue={new CalendarDate(2006, 9, 8)} labelPlacement="outside" />
            <Input isRequired type="number" onChange={(e) => handleChange('height', e.target.value)} label="Tinggi badan (cm)" placeholder="Tinggi badan" labelPlacement="outside" />
            <Input isRequired type="number" onChange={(e) => handleChange('weight', e.target.value)} label="Berat badan (kg)" placeholder="Berat badan" labelPlacement="outside" />
            <Input isRequired type="number" onChange={(e) => handleChange('water', e.target.value)} label="Air minum (ml)" placeholder="Jumlah total air minum hari ini" labelPlacement="outside" />
            <Select isRequired onChange={(e) => handleChange('gender', e.target.value)} placeholder="Select gender" label="Pilih jenis kelamin" labelPlacement="outside">
              <SelectItem key="laki-laki" startContent={<MdMan4 className="w-6 h-6" />}>
                Laki-laki
              </SelectItem>
              <SelectItem key="perempuan" startContent={<MdWoman2 className="w-6 h-6" />}>
                Perempuan
              </SelectItem>
            </Select>
            <Select isRequired onChange={(value) => handleChange('activity', Number(value))} placeholder="Pilih Kegiatan" label="Pilih jenis kegiatan harian" labelPlacement="outside">
              {activityOptions.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            <TimeInput onChange={(time) => handleChange('sleepStart', new Time(time.hour, time.minute))} isRequired label="Waktu mulai tidur" labelPlacement="outside" />
            <TimeInput onChange={(time) => handleChange('sleepEnd', new Time(time.hour, time.minute))} isRequired label="Waktu selesai tidur" labelPlacement="outside" />
          </div>
          <Button type="submit" className="mt-4" color="secondary">
            Cek
          </Button>
        </form>
        <Divider className="mt-4" />
        {submit && (
          <div className="mt-4">
            <p className="text-3xl font-bold">
              BMI : <span className={getBmiStatusColor(bmiValue)}>{bmiValue.toFixed(2)}</span>
            </p>
            <p className="text-lg mt-4">BMR : {data.BMR}</p>
            <p className="text-lg mt-4">TDEE : {data.TDEE}</p>
            <p className="text-lg mt-4">Durasi Tidur : {data.Sleep_Duration} Jam</p>
            <p className="text-lg mt-4">
              Air Minum : {formData.water} ml / {data.Water_recommendation} ml
            </p>
            <Divider className="mt-4" />
            <p className="text-lg mt-4">Saran kesehatan dari kami :</p>
            <div>{gemini ? <Markdown className="mt-3 leading-relaxed">{gemini}</Markdown> : <CircularProgress className="mx-auto" aria-label="Loading..." />}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
