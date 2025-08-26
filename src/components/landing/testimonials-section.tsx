
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const testimonials = [
  {
    name: 'Alex "Tech" Rivera',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    title: 'Tech Creator',
    description:
      '"VeriFlow revolutionized how I manage brand deals. The analytics are a game-changer and helped me double my revenue in three months!"',
  },
  {
    name: 'Sarah "Lifestyle" Chen',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    title: 'Lifestyle Influencer',
    description:
      '"I finally have a single place to see all my campaign progress and earnings. The instant payouts are a lifesaver for a full-time creator like me."',
  },
  {
    name: 'Mike "Gamer" Lee',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    title: 'Gaming Streamer',
    description:
      '"The platform is so intuitive. It saves me hours of admin work every week, letting me focus on creating content for my community."',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          Discover Why Creators{' '}
          <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Love VeriFlow
          </span>
        </h2>
        <p className="text-xl text-muted-foreground mt-2">
          Real stories from creators who have transformed their careers with us.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map(({ name, avatar, title, description }) => (
          <Card key={name} className="flex flex-col">
            <CardContent className="pt-6">
              <p className="text-lg">"{description}"</p>
            </CardContent>

            <CardHeader className="flex flex-row items-center gap-4 pt-2">
              <Avatar>
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{title}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
