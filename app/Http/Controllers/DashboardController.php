<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FrontendUser;
use App\Models\Seminar;
use App\Models\Episode;
use App\Models\Course;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PageView;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics and recent activities.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get the interval filter
        $interval = $request->get('interval', '7 day');
        
        // Get statistics based on interval
        $stats = $this->getDashboardStats($interval);
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities();
        
        // Get most viewed content
        $mostViewedContent = $this->getMostViewedContent($interval);
        
        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'mostViewedContent' => $mostViewedContent,
            'interval' => $interval
        ]);
    }
    
    /**
     * Get dashboard statistics based on interval
     */
    private function getDashboardStats($interval)
    {
        $stats = [];
        
        // Total Logins
        $stats['totalLogins'] = $this->getLoginCount($interval);
        
        // Total Registrations
        $stats['totalRegistrations'] = $this->getRegistrationCount($interval);
        
        // Total CMEs
        $stats['totalCmes'] = $this->getCmeCount($interval);
        
        // Total Webinars
        $stats['totalWebinars'] = $this->getWebinarCount($interval);
        
        // Total Posts/FAQs
        $stats['totalFaqs'] = $this->getFaqCount($interval);
        
        // Total Comments
        $stats['totalComments'] = $this->getCommentCount($interval);
        
        // Total Shared Articles
        $stats['totalSharedArticles'] = $this->getSharedArticleCount($interval);
        
        return $stats;
    }
    
    /**
     * Get login count based on interval
     */
    private function getLoginCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all login count
            return DB::table('user_login_history')->count('userID');
        } else {
            // Query to get login count for last X days/months
            return DB::table('user_login_history')
                ->whereRaw("date(timeStamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->count('userID');
        }
    }
    
    /**
     * Get registration count based on interval
     */
    private function getRegistrationCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all registration count
            return FrontendUser::count();
        } else {
            // Query to get registration count for last X days/months
            return FrontendUser::whereRaw("date(timestamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->count();
        }
    }
    
    /**
     * Get CME count based on interval
     */
    private function getCmeCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all CME count
            return Course::where('courseType', 'cme')->count();
        } else {
            // Query to get CME count for last X days/months
            return Course::where('courseType', 'cme')
                ->whereRaw("date(timestamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->count();
        }
    }
    
    /**
     * Get webinar count based on interval
     */
    private function getWebinarCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all webinar count
            return Seminar::count();
        } else {
            // Query to get webinar count for last X days/months
            return Seminar::whereRaw("date(timestamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->count();
        }
    }
    
    /**
     * Get FAQ count based on interval
     */
    private function getFaqCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all FAQ count
            return Post::where('postType', 'FAQ')->count();
        } else {
            // Query to get FAQ count for last X days/months
            return Post::where('postType', 'FAQ')
                ->whereRaw("date(post_date) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->count();
        }
    }
    
    /**
     * Get comment count based on interval
     */
    private function getCommentCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all approved comment count
            return Comment::approved()->count();
        } else {
            // Query to get approved comment count for last X days/months
            return Comment::approved()
                ->whereRaw("date(timeStamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->count();
        }
    }
    
    /**
     * Get shared article count based on interval
     */
    private function getSharedArticleCount($interval)
    {
        if ($interval == 'till date') {
            // Query to get all shared article count
            return 0;
            // return DB::table('shared_article')
            //     ->where('article_id', '!=', '')
            //     ->count('share_id');
        } else {
            // Query to get shared article count for last X days/months
            return 0;
            // return DB::table('shared_article')
            //     ->where('article_id', '!=', '')
            //     ->whereRaw("date(date_time) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
            //     ->count('share_id');
        }
    }
    
    /**
     * Get recent activities
     */
    private function getRecentActivities()
    {
        $activities = [];
        
        // Recent user logins
        $recentLogins = DB::table('user_login_history')
            ->join('frontend_users', 'user_login_history.userID', '=', 'frontend_users.user_id')
            ->select('frontend_users.user_FullName', 'frontend_users.user_email', 'user_login_history.timeStamp')
            ->orderBy('user_login_history.timeStamp', 'DESC')
            ->limit(10)
            ->get();
            
        $activities['recentLogins'] = $recentLogins;
        
        // Recent CMEs
        $recentCmes = Course::join('frontend_users', 'zc_course.Instructor', '=', 'frontend_users.user_id')
            ->select('zc_course.course_title', 'zc_course.timestamp', 'zc_course.pricing', 'zc_course.course_id', 'frontend_users.user_FullName')
            ->orderBy('zc_course.course_id', 'DESC')
            ->limit(10)
            ->get();
            
        $activities['recentCmes'] = $recentCmes;
        
        // Recent Articles
        $recentArticles = Post::join('frontend_users', 'post.author1', '=', 'frontend_users.user_id')
            ->select('post.title', 'post.postType', 'post.post_date', 'post.articleID', 'frontend_users.user_FullName')
            ->where('post.title', '!=', '')
            ->orderBy('post.articleID', 'DESC')
            ->limit(10)
            ->get();
            
        $activities['recentArticles'] = $recentArticles;
        
        // Recent Webinars
        $recentWebinars = Seminar::select('seminar_title', 'timestamp', 'seminar_no')
            ->orderBy('seminar_no', 'DESC')
            ->limit(10)
            ->get();
            
        $activities['recentWebinars'] = $recentWebinars;
        
        return $activities;
    }
    
    /**
     * Get most viewed content based on interval
     */
    private function getMostViewedContent($interval)
    {
        $content = [];
        
        // Most viewed FAQs
        if ($interval == 'till date') {
            $mostViewedFaqs = PageView::where('article_type', 'FAQ')
                ->join('post', 'page_view.article_id', '=', 'post.articleID')
                ->select('page_view.view_count_web', 'post.articleID as article_id', 'post.title')
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        } else {
            $mostViewedFaqs = PageView::where('article_type', 'FAQ')
                ->join('post', 'page_view.article_id', '=', 'post.articleID')
                ->select('page_view.view_count_web', 'post.articleID as article_id', 'post.title')
                ->whereRaw("date(page_view.date_time) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        }
        $content['mostViewedFaqs'] = $mostViewedFaqs;
        
        // Most viewed webinars
        if ($interval == 'till date') {
            $mostViewedWebinars = PageView::where('article_type', 'WEBINAR')
                ->join('seminar', 'page_view.article_id', '=', 'seminar.seminar_no')
                ->select('page_view.view_count_web', 'seminar.seminar_no as article_id', 'seminar.seminar_title')
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        } else {
            $mostViewedWebinars = PageView::where('article_type', 'WEBINAR')
                ->join('seminar', 'page_view.article_id', '=', 'seminar.seminar_no')
                ->select('page_view.view_count_web', 'seminar.seminar_no as article_id', 'seminar.seminar_title')
                ->whereRaw("date(page_view.date_time) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        }
        $content['mostViewedWebinars'] = $mostViewedWebinars;
        
        // Most viewed CMEs
        if ($interval == 'till date') {
            $mostViewedCmes = PageView::where('article_type', 'CME')
                ->join('zc_course', 'page_view.article_id', '=', 'zc_course.course_id')
                ->select('page_view.view_count_web', 'zc_course.course_id', 'zc_course.course_title')
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        } else {
            $mostViewedCmes = PageView::where('article_type', 'CME')
                ->join('zc_course', 'page_view.article_id', '=', 'zc_course.course_id')
                ->select('page_view.view_count_web', 'zc_course.course_id', 'zc_course.course_title')
                ->whereRaw("date(page_view.date_time) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        }
        $content['mostViewedCmes'] = $mostViewedCmes;
        
        // Most commented FAQs
        if ($interval == 'till date') {
            $mostCommentedFaqs = Post::where('postType', 'FAQ')
                ->join('comment_table', 'post.articleID', '=', 'comment_table.postID')
                ->select('post.articleID as postID', DB::raw('count(*) as count'), 'post.title')
                ->where('comment_table.moderation', 'approvedByAdmin')
                ->groupBy('post.articleID', 'post.title')
                ->orderBy('count', 'DESC')
                ->limit(10)
                ->get();
        } else {
            $mostCommentedFaqs = Post::where('postType', 'FAQ')
                ->join('comment_table', 'post.articleID', '=', 'comment_table.postID')
                ->select('post.articleID as postID', DB::raw('count(*) as count'), 'post.title')
                ->where('comment_table.moderation', 'approvedByAdmin')
                ->whereRaw("date(comment_table.timeStamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->groupBy('post.articleID', 'post.title')
                ->orderBy('count', 'DESC')
                ->limit(10)
                ->get();
        }
        $content['mostCommentedFaqs'] = $mostCommentedFaqs;
        
        // Most viewed episodes (evening)
        if ($interval == 'till date') {
            $mostViewedEpisodeEV = PageView::where('article_type', 'MEDTALKSTV')
                ->join('medtalks_tv', 'page_view.article_id', '=', 'medtalks_tv.id')
                ->select('page_view.view_count_web', 'medtalks_tv.title')
                ->where('medtalks_tv.episode_status', 'active')
                ->where('medtalks_tv.video_status', '!=', 'deleted')
                ->where('medtalks_tv.episode_type', 'evening')
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        } else {
            $mostViewedEpisodeEV = PageView::where('article_type', 'MEDTALKSTV')
                ->join('medtalks_tv', 'page_view.article_id', '=', 'medtalks_tv.id')
                ->select('page_view.view_count_web', 'medtalks_tv.title')
                ->where('medtalks_tv.episode_status', 'active')
                ->where('medtalks_tv.video_status', '!=', 'deleted')
                ->where('medtalks_tv.episode_type', 'evening')
                ->whereRaw("date(medtalks_tv.timestamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        }
        $content['mostViewedEpisodeEV'] = $mostViewedEpisodeEV;
        
        // Most viewed episodes (afternoon)
        if ($interval == 'till date') {
            $mostViewedEpisodeAF = PageView::where('article_type', 'MEDTALKSTV')
                ->join('medtalks_tv', 'page_view.article_id', '=', 'medtalks_tv.id')
                ->select('page_view.view_count_web', 'medtalks_tv.title')
                ->where('medtalks_tv.episode_status', 'active')
                ->where('medtalks_tv.video_status', '!=', 'deleted')
                ->where('medtalks_tv.episode_type', 'afternoon')
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        } else {
            $mostViewedEpisodeAF = PageView::where('article_type', 'MEDTALKSTV')
                ->join('medtalks_tv', 'page_view.article_id', '=', 'medtalks_tv.id')
                ->select('page_view.view_count_web', 'medtalks_tv.title')
                ->where('medtalks_tv.episode_status', 'active')
                ->where('medtalks_tv.video_status', '!=', 'deleted')
                ->where('medtalks_tv.episode_type', 'afternoon')
                ->whereRaw("date(medtalks_tv.timestamp) between (DATE_FORMAT(CURRENT_DATE - INTERVAL $interval, '%y-%m-%d')) and CURRENT_DATE()")
                ->orderBy('page_view.view_count_web', 'DESC')
                ->limit(10)
                ->get();
        }
        $content['mostViewedEpisodeAF'] = $mostViewedEpisodeAF;
        
        return $content;
    }
}