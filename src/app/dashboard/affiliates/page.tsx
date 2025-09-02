
'use client';

import React, { useState, useEffect } from 'react';
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
import { Users, DollarSign, UserPlus, Copy, Check, Loader2, AlertCircle, GitMerge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Referral {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  status: 'Active' | 'Pending';
  commission: number;
  level: 1 | 2;
}

const MetricCard = ({ title, value, icon: Icon, loading }: {title: string, value: string | number, icon: React.ElementType, loading?: boolean}) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
      </CardContent>
    </Card>
);


export default function AffiliatesPage() {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAffiliateData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/affiliates');
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Failed to fetch affiliate data.');
                }
                
                setReferrals(result.data.referrals);
                setTotalReferrals(result.data.totalReferrals);
                setTotalEarnings(result.data.totalAffiliateEarnings);
                setReferralLink(result.data.referralLink);

            } catch (err: any) {
                setError(err.message);
                toast({
                    title: 'Error',
                    description: err.message,
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAffiliateData();
    }, [toast]);
    
    const handleCopy = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast({
            title: 'Copied to clipboard!',
            description: 'Your referral link is ready to be shared.',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const directReferralsCount = referrals.filter(r => r.level === 1).length;
    const indirectReferralsCount = referrals.filter(r => r.level === 2).length;

  return (
    <TooltipProvider>
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
              <CardDescription>Share this link. You earn 10% from your direct referrals' subscriptions and 2% from their referrals' subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
               <div className="flex w-full max-w-lg items-center space-x-2">
                  {loading ? <Skeleton className="h-10 flex-grow" /> : <Input type="text" value={referralLink} readOnly className="font-mono"/> }
                  <Button type="button" size="icon" onClick={handleCopy} disabled={loading}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
              </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Referrals" value={totalReferrals} icon={Users} loading={loading}/>
          <MetricCard title="Direct Referrals" value={directReferralsCount} icon={UserPlus} loading={loading} />
          <MetricCard title="Indirect Referrals" value={indirectReferralsCount} icon={GitMerge} loading={loading} />
          <MetricCard title="Total Affiliate Earnings" value={`KES ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} loading={loading} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              A list of creators you've invited to hearts on tiktok, directly and indirectly.
            </CardDescription>
          </CardHeader>
          <CardContent>
              {loading ? (
                   <div className="space-y-4">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                   </div>
              ) : error ? (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                      <p className="font-semibold">Failed to load referrals</p>
                      <p className="text-muted-foreground text-sm">{error}</p>
                  </div>
              ) : (
                  <Table>
                      <TableHeader>
                      <TableRow>
                          <TableHead>Creator</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className="text-right">Commission Earned</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {referrals.length > 0 ? referrals.map((referral) => (
                          <TableRow key={referral.id}>
                          <TableCell>
                              <div className="flex items-center gap-3">
                                  <Image src={referral.avatar || 'https://i.pravatar.cc/150'} alt={referral.name} width={40} height={40} className="rounded-full" data-ai-hint="creator avatar" />
                                  <span className="font-medium">{referral.name}</span>
                              </div>
                          </TableCell>
                           <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant={referral.level === 1 ? 'default' : 'secondary'}>
                                  Level {referral.level}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {referral.level === 1 ? 'Direct Referral (10% commission)' : 'Indirect Referral (2% commission)'}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{new Date(referral.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">KES {referral.commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                              <TableCell colSpan={4} className="text-center h-24">
                                  You haven't referred any creators yet.
                              </TableCell>
                          </TableRow>
                      )}
                      </TableBody>
                  </Table>
              )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
