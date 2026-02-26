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
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent className="-ml-2">
        {clients.map((client) => (
          <CarouselItem
            key={client.name}
            className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <div className="flex items-center justify-center p-4 h-20">
              <Image
                src={client.logo}
                alt={client.name}
                width={160}
                height={60}
                className="object-contain max-h-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
