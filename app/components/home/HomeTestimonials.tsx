"use client";

const testimonials = [
  {
    id: 1,
    rating: 5,
    content:
      "Honestly, MyMirro changed the way I see fashion. Their recommendations were spot on and completely transformed my look. Now, I feel more confident in what I wear! ",
    image: "/path/to/image1.jpg",
    name: "Ritika Verma",
    title: "",
  },
  {
    id: 2,
    rating: 5,
    content:
      "I used to spend forever scrolling through endless products on other sites, never finding exactly what I wanted. MyMirro made it so easy by showing me exactly what I needed, no more endless browsing!",
    image: "/path/to/image2.jpg",
    name: "Aanya Gupta",
    title: "",
  },
  {
    id: 3,
    rating: 5,
    content:
      "The whole experience with MyMirro was amazing! From the styling advice to the quality of the clothes, everything was spot on. I felt like I had my own personal stylist the whole time!",
    image: "/path/to/image3.jpg",
    name: "Rohit Mehta",
    title: "",
  },
  {
    id: 4,
    rating: 5,
    content: "Very satisfied with my purchase. Good value for money.",
    image: "/path/to/image4.jpg",
    name: "Bob Brown",
    title: "Developer, Company D",
  },
  {
    id: 5,
    rating: 5,
    content: "A must-have for anyone looking to improve their workflow.",
    image: "/path/to/image5.jpg",
    name: "Charlie Green",
    title: "Entrepreneur, Company E",
  },
  {
    id: 6,
    rating: 5,
    content: "Solid product with great features. Highly recommend!",
    image: "/path/to/image6.jpg",
    name: "Diana White",
    title: "Consultant, Company F",
  },
  {
    id: 7,
    rating: 5,
    content: "Incredible experience! Will definitely be back for more.",
    image: "/path/to/image7.jpg",
    name: "Ethan Black",
    title: "Marketer, Company G",
  },
  {
    id: 8,
    rating: 4,
    content: "Good product, but there is room for improvement.",
    image: "/path/to/image8.jpg",
    name: "Fiona Blue",
    title: "Analyst, Company H",
  },
];

const HomeTestimonials = () => {
  return (
    <section
      className="relative py-16 bg-fixed bg-cover h-[600px] bg-center w-screen max-w -mx-[calc((100vw-100%)/2)] min-h-[500px]"
      style={{
        backgroundImage: `url('/assets/testimonials.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-white mb-1"></h2>

        <div className="flex flex-wrap -mx-4 justify-center">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full md:w-1/2 lg:w-1/3 px-4 mb-1"
            >
              <div className="flex flex-col items-center text-center bg-opacity-0 rounded-lg p-6 h-full">
                {/* Rating Stars - Centered */}
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Content - Limited to 3 lines */}
                <p className="text-white text-sm mb-2  font-light tracking-wider leading-5 max-w-md">
                  "{testimonial.content}"
                </p>

                {/* Image and Name - Centered */}
                <div className="flex flex-col items-center">
                
                  <div className="text-center">
                    <p className="text-white font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-300 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials; 