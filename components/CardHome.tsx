import { Button, Card, CardBody, CardFooter, CardHeader, Link } from '@nextui-org/react';
import Image from 'next/image';
import { MdNavigateNext } from 'react-icons/md';

interface CardHomeProps {
  title: string;
  image: string;
  desc: string;
  link: string;
  Icon: React.ComponentType<{ className?: string }>;
}
const CardHome = ({ title, image, desc, link, Icon }: CardHomeProps) => {
  return (
    <Card className="w-full max-w-[400px] px-3">
      <CardHeader className="">
        <h1 className="text-xl font-bold flex gap-2 items-center">
          {title}
          <span className={''}>
            <Icon className="bg-clip-text fill-[#b249f8] " />
          </span>
        </h1>
      </CardHeader>
      <CardBody className="block">
        <div className="w-full h-52">
          <Image src={image} className="w-full h-full object-cover" alt="bmi" width={200} height={200} />
        </div>
        <p className="text-sm mt-4 line-clamp-3">{desc}</p>
        <Button className="mt-3" href={link} as={Link} color="secondary" variant="ghost" endContent={<MdNavigateNext className="w-5 h-5" />}>
          Coba
        </Button>
      </CardBody>

      <CardFooter></CardFooter>
    </Card>
  );
};

export default CardHome;
