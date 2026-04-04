import Link from 'next/link'

export default function About() {
  const coreValues = [
    { title: 'Faith Inspired', description: 'We are committed to walking by faith and not by sight.' },
    { title: 'Generous Hearts', description: 'We believe in giving cheerfully and sacrificially.' },
    { title: 'Holy Spirit Dependent', description: 'We rely on the Holy Spirit for guidance and power.' },
    { title: 'Joy', description: 'We serve God with gladness and joy.' },
    { title: 'Love', description: 'Love is the foundation of all we do.' },
    { title: 'People First', description: 'We prioritize people over programs.' },
    { title: 'Responsible Stewardship', description: 'We are faithful managers of God\'s resources.' },
    { title: 'Soul Winning', description: 'We are committed to sharing the gospel with the world.' },
  ]

  return (
    <div>
      {/* Compact Hero Section */}
      <section className="relative py-8 sm:py-10 text-white overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#1e3a5f]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">About Us</h1>
            <p className="text-sm sm:text-base text-white/80">Learn more about our history, mission, and leadership</p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-900">Our History</h2>
            <div className="bg-gray-50 p-5 sm:p-8 rounded-xl mb-6 sm:mb-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                <p><strong>Founded:</strong> 1888</p>
                <p><strong>Location:</strong> 50A Campbell Street, Marina, Lagos Island</p>
                <p><strong>Heritage:</strong> Over 138 years of faithful service</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
              <p>
                Ebenezer Baptist Church traces its roots to the vibrant Christian community that emerged in Lagos Island during the late 19th century. The church was founded in 1888 by a group of devoted Christians who desired to establish a place of worship that would serve the spiritual needs of the growing population in the Marina area.
              </p>
              <p>
                The name "Ebenezer" means "stone of help" in Hebrew, taken from 1 Samuel 7:12, where Samuel set up a stone to commemorate God's help and protection. The founders chose this name to testify of God's faithfulness and assistance in their journey of faith.
              </p>
              <p>
                From its humble beginnings in a small structure, the church grew steadily under the leadership of dedicated pastors and lay leaders. The congregation consisted mainly of traders, professionals, and families who lived and worked in the bustling Lagos Island area.
              </p>
              <p>
                Throughout the years, Ebenezer Baptist Church has been a beacon of hope and spiritual guidance to its members and the surrounding community. The church played a significant role in the establishment of educational institutions and social welfare programs in the Lagos Island area.
              </p>
              <p>
                The church building itself is a testimony to the faithfulness of God and the dedication of its members. Over the decades, it has been renovated and expanded to accommodate the growing congregation while preserving its historical heritage and architectural significance.
              </p>
              <p>
                Today, Ebenezer Baptist Church continues to thrive as a vibrant center of worship, discipleship, and community service. With a rich history spanning over 138 years, the church remains committed to its founding vision of reaching the unreached with the message of the cross in the power of the Holy Spirit.
              </p>
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://www.google.com/maps/place/Ebenezer+Baptist+Church/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-6 sm:px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition inline-block text-sm sm:text-base"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-vision" className="py-12 sm:py-16 md:py-20 section-bg-elegant text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">Our Vision & Mission</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
              <div className="bg-white/10 backdrop-blur p-5 sm:p-6 rounded-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Vision</h3>
                <p className="text-base sm:text-lg">
                  Reaching the unreached with the message of the cross in the power of the Holy Spirit.
                </p>
                <p className="mt-4 italic text-white/70">
                  Motto: "...led by the Spirit of God"
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur p-5 sm:p-6 rounded-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Mission</h3>
                <p className="text-base sm:text-lg">
                  Our mission is to glorify God by making disciples who are Spirit-filled,
                  word-based, and committed to transforming lives and communities through
                  the gospel of Jesus Christ.
                </p>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center">Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white/10 backdrop-blur p-4 sm:p-6 rounded-xl">
                  <h4 className="text-base sm:text-lg font-bold mb-2">{value.title}</h4>
                  <p className="text-sm sm:text-base text-white/80">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Executives CTA */}
      <section id="executives" className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">Our Executives</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Meet the dedicated leaders who serve our church community with passion and commitment.
          </p>
          <Link
            href="/about/executives"
            className="bg-gradient-to-r from-[#1e3a5f] to-[#1e3a5f] text-white px-6 sm:px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 inline-block text-sm sm:text-base"
          >
            Meet Our Team
          </Link>
        </div>
      </section>
    </div>
  )
}
