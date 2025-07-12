
import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="" >
        <HeroSection />


        <div className="-mt-[225vh]" >


          {/* stats section */}
          <section className=" py-20  bg-blue-50 ">
            <div className=" container mx-auto px-4 " >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 " >
                {statsData.map((statsData, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2 ">{statsData.value}</div>
                    <div className="text-gray-600" >{statsData.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* feature section */}

          <section className="py-20">
            <div className="container px-4 mx-auto ">
              <h1 className="text-3xl font-bold text-center mb-12">
                Everything you need to manage your finances
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuresData.map((feature, idx) => (
                  <div key={idx} className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
                    <GlowingEffect
                      blur={0}
                      borderWidth={3}
                      spread={80}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                    />
                    <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                      <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2">
                          {feature.icon}
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-black dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it's work */}
          <section className="py-20 bg-blue-50">
            <div className="container px-4 mx-auto ">
              <h1 className=" text-3xl font-bold text-center mb-16 " >How It Works</h1>
              <div className=" grid grid-cols-1 md:grid-cols-3  gap-8 ">
                {howItWorksData.map((step, idx) => (
                  <div key={idx} className="text-center" >
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 ">{step.icon}</div>
                    <h2 className=" text-xl font-semibold mb-4 " >{step.title}</h2>
                    <p className="text-gray-500" >{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* testimonial section */}
          <section className="py-20">
            <div className="container px-4 mx-auto ">
              <h1 className=" text-3xl font-bold text-center mb-12 " >What ours Users say</h1>
              <div className=" grid grid-cols-1 md:grid-cols-3 gap-8 ">
                {testimonialsData.map((testimonialsData, idx) => (
                  <Card key={idx} className="p-6" >
                    <CardContent className="pt-4 " >
                      <div className="flex items-center mb-4 ">
                        <Image
                          src={testimonialsData.image}
                          alt={testimonialsData.name}
                          width={70}
                          height={70}
                          className="rounded-full "
                        />
                        <div className="ml-4" >
                          <div className="font-semibold" >{testimonialsData.name}</div>
                          <div className="text-sm text-gray-500" >{testimonialsData.role}</div>
                        </div>


                      </div>
                      <p className="text-gray-500 " >{testimonialsData.quote}</p>

                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Action Button */}

          <section className="py-20 bg-blue-600 ">
            <div className="container px-4 mx-auto text-center ">
              <h1 className=" text-3xl font-bold text-center mb-4  text-white " >
                Ready to Take Control of Your Finances?
              </h1>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto " >Join thousands of users who are already managing their finances smarter with ExpensifyX</p>
              <Link href={"/dashboard"}>
                <Button
                  size={"lg"}
                  className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer animate-bounce px-7 "
                >
                  Start Free Trial
                </Button>
              </Link>

            </div>
          </section>

        </div>
      </div>
    </>
  );
}
