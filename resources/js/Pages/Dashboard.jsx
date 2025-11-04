import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export default function Dashboard({ stats, recentActivities, mostViewedContent, interval }) {
    // Function to handle interval change
    const handleIntervalChange = (e) => {
        const newInterval = e.target.value;
        window.location.href = `/dashboard?interval=${newInterval}`;
    };

    // Format interval for display
    const formatInterval = (interval) => {
        switch(interval) {
            case '1 day': return 'Last 1 Day';
            case '7 day': return 'Last 7 Days';
            case '15 day': return 'Last 15 Days';
            case '30 day': return 'Last 30 Days';
            case '3 month': return 'Last 3 Months';
            case '6 month': return 'Last 6 Months';
            case 'till date': return 'All Time';
            default: return 'Last 7 Days';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <div className="mt-2 md:mt-0">
                        <select 
                            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={interval}
                            onChange={handleIntervalChange}
                        >
                            <option value="1 day">Last 1 Day</option>
                            <option value="7 day">Last 7 Days</option>
                            <option value="15 day">Last 15 Days</option>
                            <option value="30 day">Last 30 Days</option>
                            <option value="3 month">Last 3 Months</option>
                            <option value="6 month">Last 6 Months</option>
                            <option value="till date">All Time</option>
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                                        <i className="fa fa-sign-in text-emerald-600 text-xl"></i>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Logins</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stats.totalLogins}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <i className="fa fa-user-plus text-blue-600 text-xl"></i>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stats.totalRegistrations}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                        <i className="fa fa-graduation-cap text-purple-600 text-xl"></i>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total CMEs</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stats.totalCmes}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                                        <i className="fa fa-video-camera text-amber-600 text-xl"></i>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Webinars</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stats.totalWebinars}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                        <i className="fa fa-question-circle text-red-600 text-xl"></i>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total FAQs</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stats.totalFaqs}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                        <i className="fa fa-comments text-indigo-600 text-xl"></i>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Comments</dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">{stats.totalComments}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Charts Section - Individual Cards for Each Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Most Viewed FAQs Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Most Viewed FAQs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mostViewedContent.mostViewedFaqs && mostViewedContent.mostViewedFaqs.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Views</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mostViewedContent.mostViewedFaqs.slice(0, 10).map((faq, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{faq.title}</TableCell>
                                                    <TableCell className="text-sm">{faq.view_count_web}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Most Viewed Webinars Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Most Viewed Webinars</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mostViewedContent.mostViewedWebinars && mostViewedContent.mostViewedWebinars.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Views</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mostViewedContent.mostViewedWebinars.slice(0, 10).map((webinar, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{webinar.seminar_title}</TableCell>
                                                    <TableCell className="text-sm">{webinar.view_count_web}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Most Viewed CMEs Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Most Viewed CMEs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mostViewedContent.mostViewedCmes && mostViewedContent.mostViewedCmes.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Views</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mostViewedContent.mostViewedCmes.slice(0, 10).map((cme, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{cme.course_title}</TableCell>
                                                    <TableCell className="text-sm">{cme.view_count_web}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Most Commented FAQs Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Most Commented FAQs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mostViewedContent.mostCommentedFaqs && mostViewedContent.mostCommentedFaqs.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Comments</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mostViewedContent.mostCommentedFaqs.slice(0, 10).map((faq, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{faq.title}</TableCell>
                                                    <TableCell className="text-sm">{faq.count}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Most Viewed Evening Episodes Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Most Viewed Evening Episodes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mostViewedContent.mostViewedEpisodeEV && mostViewedContent.mostViewedEpisodeEV.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Views</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mostViewedContent.mostViewedEpisodeEV.slice(0, 10).map((episode, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{episode.title}</TableCell>
                                                    <TableCell className="text-sm">{episode.view_count_web}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Most Viewed Afternoon Episodes Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Most Viewed Afternoon Episodes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mostViewedContent.mostViewedEpisodeAF && mostViewedContent.mostViewedEpisodeAF.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Views</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mostViewedContent.mostViewedEpisodeAF.slice(0, 10).map((episode, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{episode.title}</TableCell>
                                                    <TableCell className="text-sm">{episode.view_count_web}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                   

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Articles Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Articles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentActivities.recentArticles && recentActivities.recentArticles.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Type</TableHead>
                                                <TableHead className="text-sm font-medium">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentActivities.recentArticles.slice(0, 10).map((article, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{article.title}</TableCell>
                                                    <TableCell className="text-sm">{article.postType}</TableCell>
                                                    <TableCell className="text-sm">{article.post_date}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No recent articles</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Webinars Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Webinars</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentActivities.recentWebinars && recentActivities.recentWebinars.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm font-medium">Title</TableHead>
                                                <TableHead className="text-sm font-medium">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentActivities.recentWebinars.slice(0, 10).map((webinar, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-sm">{webinar.seminar_title}</TableCell>
                                                    <TableCell className="text-sm">{webinar.timestamp}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">No recent webinars</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}