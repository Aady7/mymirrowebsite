"use client"; // Indicate that this component uses client-side code


const testimonials = [
  {
    id: 1,
    rating: 5,
    content:
      "This product has changed my life! Highly recommend it to everyone.",
    image: "/path/to/image1.jpg",
    name: "John Doe",
    title: "CEO, Company A",
  },
  {
    id: 2,
    rating: 4,
    content: "Great quality and fantastic support. Will buy again!",
    image: "/path/to/image2.jpg",
    name: "Jane Smith",
    title: "Manager, Company B",
  },
  {
    id: 3,
    rating: 5,
    content: "Absolutely fantastic! Exceeded my expectations.",
    image: "/path/to/image3.jpg",
    name: "Alice Johnson",
    title: "Designer, Company C",
  },
  {
    id: 4,
    rating: 4,
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
    rating: 4,
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

const TestimonialSection = () => {
  return (
    <section
      className="relative py-16 bg-fixed bg-cover bg-center w-screen max-w -mx-[calc((100vw-100%)/2)] min-h-[500px]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1583530738247-444ce8342b9a?auto=format&fit=crop&w=1920')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-12"></h2>

        <div className="flex flex-wrap -mx-4 justify-center">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
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
                <p className="text-white italic mb-6 line-clamp-3 max-w-md">
                  "{testimonial.content}"
                </p>

                {/* Image and Name - Centered */}
                <div className="flex flex-col items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mb-2"
                  />
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

export default TestimonialSection;
