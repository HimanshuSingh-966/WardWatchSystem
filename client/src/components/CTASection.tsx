import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Ready to Transform Your Patient Care?
        </h2>
        <p className="text-lg mb-8 text-primary-foreground/90">
          Join healthcare facilities already using Ward Watch to improve patient outcomes and streamline nursing workflows.
        </p>
        <Link href="/login">
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg font-semibold"
            data-testid="button-cta-start"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
