'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, FileText, TrendingUp, Play, Heart, Video, Check, X } from 'lucide-react';
import { User, Transaction, CampaignSubmission } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const MetricCard = ({ title, value, icon: Icon, loading }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  loading?: boolean;
}) => (
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [submissions, setSubmissions] = useState<CampaignSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingPayouts: 0
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, transactionsRes, submissionsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/transactions'),
          fetch('/api/admin/submissions')
        ]);

        if (!usersRes.ok || !transactionsRes.ok || !submissionsRes.ok) {
          throw new Error('Failed to fetch admin data');
        }

        const [usersData, transactionsData, submissionsData] = await Promise.all([
          usersRes.json(),
          transactionsRes.json(),
          submissionsRes.json()
        ]);

        setUsers(usersData.users || []);
        setTransactions(transactionsData.transactions || []);
        setSubmissions(submissionsData.submissions || []);

        // Calculate metrics
        const activeSubscriptions = usersData.users?.filter((u: User) => u.subscriptionStatus === 'ACTIVE').length || 0;
        const totalRevenue = transactionsData.transactions?.filter((t: Transaction) => t.type === 'subscription' && t.status === 'completed')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0;
        const pendingPayouts = transactionsData.transactions?.filter((t: Transaction) => t.type === 'payout' && t.status === 'pending')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0;

        setMetrics({
          totalUsers: usersData.users?.length || 0,
          activeSubscriptions,
          totalRevenue,
          pendingPayouts
        });

      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      pending: 'outline',
      PENDING_APPROVAL: 'outline', // Add variant for new status
      completed: 'default',
      failed: 'destructive',
      approved: 'default',
      APPROVED: 'default',
      rejected: 'destructive',
      REJECTED: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const handleReview = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/submissions/review', {
        method: 'POST',
        body: JSON.stringify({ submissionId: id, action })
      });
      const result = await res.json();

      if (res.ok) {
        toast({ title: 'Success', description: `Submission ${action}D successfully` });
        // Optimistic update
        setSubmissions(prev => prev.map(s =>
          s.id === id ? { ...s, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : s
        ));
      } else {
        toast({ title: 'Error', variant: 'destructive', description: result.error || 'Failed to update' });
      }
    } catch (e: any) {
      toast({ title: 'Error', variant: 'destructive', description: e.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, transactions, and campaign submissions</p>
        </div>
        <Button 
          onClick={async () => {
            try {
              const response = await fetch('/api/admin/timeout-check', { method: 'POST' });
              const result = await response.json();
              toast({
                title: result.success ? 'Success' : 'Error',
                description: result.message,
                variant: result.success ? 'default' : 'destructive'
              });
            } catch (error) {
              toast({ title: 'Error', description: 'Failed to check timeouts', variant: 'destructive' });
            }
          }}
        >
          Check Timeouts
        </Button>
      </div>

      {/* Review Handler */}
      {/* Note: Inserted via multi_replace but defined logically here */}


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Users" value={metrics.totalUsers} icon={Users} loading={loading} />
        <MetricCard title="Active Subscriptions" value={metrics.activeSubscriptions} icon={TrendingUp} loading={loading} />
        <MetricCard title="Total Revenue" value={`KES ${metrics.totalRevenue.toLocaleString()}`} icon={DollarSign} loading={loading} />
        <MetricCard title="Pending Payouts" value={`KES ${metrics.pendingPayouts.toLocaleString()}`} icon={FileText} loading={loading} />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="submissions">Campaign Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.displayName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getStatusBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.subscriptionStatus)}</TableCell>
                        <TableCell>{user.subscriptionPlan || 'None'}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View subscription payments, payouts, and affiliate earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="capitalize">{transaction.type}</TableCell>
                        <TableCell>KES {transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Submissions</CardTitle>
              <CardDescription>Review and approve creator campaign submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Video URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                      submissions.map((submission) => {
                        const creator = users.find(u => u.id === submission.userId);
                        return (
                          <TableRow key={submission.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{submission.campaignName || 'Unknown Campaign'}</span>
                                <span className="text-xs text-muted-foreground">{submission.campaignId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {creator ? (
                                  <>
                                    {/* Using a simple avatar placeholder if photoURL is missing, or initials */}
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                      {creator.photoURL ? (
                                        <img src={creator.photoURL} alt={creator.displayName} className="h-full w-full object-cover" />
                                      ) : (
                                        <span className="text-xs font-bold">{creator.displayName?.substring(0, 2).toUpperCase()}</span>
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{creator.displayName}</span>
                                      <span className="text-xs text-muted-foreground">{creator.email}</span>
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">Unknown User ({submission.userId})</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <a
                                href={submission.videoUrl || `https://www.tiktok.com/@/video/${submission.tiktokVideoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block w-32 aspect-video rounded-md overflow-hidden bg-black/10 border border-white/10"
                              >
                                {submission.cover_image_url ? (
                                  <img src={submission.cover_image_url} alt="Video thumbnail" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    <Video className="h-6 w-6" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="currentColor" />
                                </div>
                              </a>
                            </TableCell>
                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-red-500" />
                                <span>{submission.likes?.toLocaleString() || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{submission.earnings ? `KES ${submission.earnings}` : '-'}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(submission.createdAt).toLocaleDateString()} <br />
                              <span className="text-xs">{new Date(submission.createdAt).toLocaleTimeString()}</span>
                            </TableCell>
                            <TableCell>
                              {submission.status === 'PENDING_APPROVAL' && (
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleReview(submission.id, 'APPROVE')} className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3">
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleReview(submission.id, 'REJECT')} className="h-8 px-3">
                                    <X className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}