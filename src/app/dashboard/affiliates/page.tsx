
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, UserPlus, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const referrals = [
    {
      id: 'usr_1',
      name: 'Alex "Tech" Rivera',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      joinDate: '2023-10-15',
      status: 'Active',
      earnings: 1250.75,
    },
    {
      id: 'usr_2',
      name: 'Sarah "Lifestyle" Chen',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      joinDate: '2023-11-02',
      status: 'Active',
      earnings: 850.50,
    },
    {
      id: 'usr_3',
      name: 'Mike "Gamer" Lee',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
      joinDate: '2023-11-20',
      status: 'Pending',
      earnings: 0.00,
    },
    {
      id: 'usr_4',
      name: 'Emily "Foodie" Garcia',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
      joinDate: '2023-12-01',
      status: 'Active',
      earnings: 450.00,
    },
];

const MetricCard = ({ title, value, icon: Icon }: {title: string, value: string | number, icon: React.ElementType}) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
);


export default function AffiliatesPage() {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const referralLink = 'https://veriflow.app/join?ref=creator123';
    
    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast({
            title: 'Copied to clipboard!',
            description: 'Your referral link is ready to be shared.',
        });
        setTimeout(() => setCopied(false), 2000);
    };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your referrals and grow your earnings.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link to invite other creators. You earn 10% of their views and from the users they invite.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex w-full max-w-lg items-center space-x-2">
                <Input type="text" value={referralLink} readOnly className="font-mono"/>
                <Button type="button" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total Referrals" value={referrals.length} icon={Users} />
        <MetricCard title="Active Referrals" value={referrals.filter(r => r.status === 'Active').length} icon={UserPlus} />
        <MetricCard title="Total Affiliate Earnings" value={`KES ${referrals.reduce((sum, r) => sum + r.earnings, 0).toLocaleString()}`} icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            A list of creators you've invited to VeriFlow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Image src={referral.avatar} alt={referral.name} width={40} height={40} className="rounded-full" data-ai-hint="creator avatar" />
                        <span className="font-medium">{referral.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(referral.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">KES {referral.earnings.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

