"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const clients = [
  { name: "Aterpa", logo: "/images/clients/aterpa.jpg" },
  { name: "Coedra", logo: "/images/clients/coedra.jpg" },
  { name: "Vale", logo: "/images/clients/vale.jpg" },
  { name: "SG Bras", logo: "/images/clients/sgbras.jpg" },
  { name: "SCL", logo: "/images/clients/scl.jpg" },
];

export function ClientCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: false,
        }),
      ]}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent className="-ml-4">
        {clients.map((client) => (
          <CarouselItem key={client.name} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="flex items-center justify-center p-4 h-24 md:h-32 rounded-[1.875rem] bg-white">
              <Image
                src={client.logo}
                alt={client.name}
                width={180}
                height={70}
                className="object-contain max-h-16"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
