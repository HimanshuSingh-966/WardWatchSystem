import nurseImage from "@assets/generated_images/Nurse_using_digital_system_632d7e75.png";
import teamImage from "@assets/generated_images/Medical_team_collaboration_3a2ea817.png";

const benefits = [
  {
    title: "Reduce Medication Errors",
    description: "Time-based medication scheduling with completion tracking ensures every dose is administered correctly and on time. Priority alerts highlight critical medications that need immediate attention.",
    image: nurseImage,
    reverse: false,
  },
  {
    title: "Improve Team Collaboration",
    description: "Centralized patient information and treatment plans keep your entire care team synchronized. Real-time updates ensure everyone has access to the latest patient status and treatment decisions.",
    image: teamImage,
    reverse: true,
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-8">
        <div className="space-y-24">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`flex flex-col ${benefit.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              <div className="flex-1">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-semibold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
