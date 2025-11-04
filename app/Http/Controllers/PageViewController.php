<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PageView;
use App\Models\Post;
use App\Models\Course;
use App\Models\Seminar;
use App\Models\Episode;
use App\Models\Specialty;
use Illuminate\Support\Facades\DB;

class PageViewController extends Controller
{
    /**
     * Display the page views analytics dashboard.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $type = $request->get('type', 'faq');
        $specId = $request->get('spec_id');
        
        // Get specialty options for FAQ filter
        $specialties = Specialty::where('speciality_type', 'sponsored')
            ->where('status', 'on')
            ->orderBy('title')
            ->get(['no', 'title']);
        
        return Inertia::render('PageViews/Index', [
            'type' => $type,
            'specId' => $specId,
            'specialties' => $specialties
        ]);
    }
    
    /**
     * Get analytics data based on type and filters
     */
    public function getData(Request $request)
    {
        $type = $request->get('type', 'faq');
        $specId = $request->get('spec_id');
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        
        // Get specialty options for FAQ filter
        $specialties = Specialty::where('speciality_type', 'sponsored')
            ->where('status', 'on')
            ->orderBy('title')
            ->get(['no', 'title']);
        
        switch ($type) {
            case 'faq':
                $data = $this->getFaqData($specId, $page, $perPage);
                break;
            case 'cme':
                $data = $this->getCmeData($page, $perPage);
                break;
            case 'seminar':
                $data = $this->getSeminarData($page, $perPage);
                break;
            case 'episodeafternoon':
                $data = $this->getEpisodeData('afternoon', $page, $perPage);
                break;
            case 'episodeevening':
                $data = $this->getEpisodeData('evening', $page, $perPage);
                break;
            case 'spec':
                if (empty($specId)) {
                    $data = $this->getSpecData($page, $perPage);
                } else {
                    $data = $this->getSpecFaqData($specId, $page, $perPage);
                }
                break;
            default:
                $data = ['data' => [], 'pagination' => []];
        }
        
        // Return Inertia response with pagination data
        return Inertia::render('PageViews/Index', [
            'data' => $data['data'],
            'specialties' => $specialties,
            'pagination' => $data['pagination'] ?? []
        ]);
    }
    
    /**
     * Get FAQ data
     */
    private function getFaqData($specId = null, $page = 1, $perPage = 10)
    {
        $query = PageView::where('article_type', 'FAQ')
            ->join('post', 'page_view.article_id', '=', 'post.articleID')
            ->where('post.status', 'published')
            ->where('post.title', '!=', '')
            ->where('post.custom_url', '!=', '')
            ->select(
                'page_view.article_id',
                'post.title',
                'post.custom_url',
                'post.post_date as date_time',
                'post.catagory1',
                DB::raw('SUM(page_view.view_count_web) as view_count_web'),
                DB::raw("GROUP_CONCAT(CONCAT(IF(page_view.utm_source='', 'original', page_view.utm_source), ':', page_view.view_count_web) SEPARATOR ', ') as utm_details")
            )
            ->groupBy('page_view.article_id', 'post.title', 'post.custom_url', 'post.post_date', 'post.catagory1');
        
        if ($specId) {
            $query->where('post.catagory1', $specId);
        }
        
        // Get total count for pagination
        $total = $query->count();
        
        // Apply pagination
        $results = $query->orderBy('post.articleID', 'DESC')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        // Add subscription count and URL
        $oralSpecArr = [378, 379, 380, 384];
        
        $data = $results->map(function ($item) use ($oralSpecArr) {
            // Generate URL based on category
            if (in_array($item->catagory1, $oralSpecArr)) {
                $customUrl = "https://www.medtalks.in/oral-hygiene-articles/" . $item->custom_url;
            } elseif ($item->catagory1 == 389) {
                $customUrl = "https://pediatricscasestudy.medtalks.in/case-studies/" . $item->custom_url;
            } else {
                $customUrl = "https://www.medtalks.in/articles/" . $item->custom_url;
            }
            
            // Get subscription count
            $subscribeCount = Subscribe::where('ref_id', $item->article_id)
                ->where('type', 'faq')
                ->distinct('user_id')
                ->count('user_id');
            
            return [
                'id' => $item->article_id,
                'title' => $item->title,
                'custom_url' => $customUrl,
                'date_time' => $item->date_time,
                'view_count_web' => $item->view_count_web,
                'utm_details' => $item->utm_details,
                'subscribe_count' => $subscribeCount
            ];
        });
        
        // Prepare pagination data
        $pagination = [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total)
        ];
        
        return ['data' => $data, 'pagination' => $pagination];
    }
    
    /**
     * Get CME data
     */
    private function getCmeData($page = 1, $perPage = 10)
    {
        $query = PageView::where('article_type', 'CME')
            ->join('zc_course', 'page_view.article_id', '=', 'zc_course.course_id')
            ->whereIn('zc_course.status', ['live', 'new'])
            ->where('zc_course.custom_url', '!=', '')
            ->select(
                'page_view.article_id as course_id',
                'zc_course.course_title as title',
                'zc_course.custom_url',
                'zc_course.timestamp as date_time',
                'page_view.view_count_web',
                'page_view.utm_source'
            )
            ->groupBy('page_view.article_id', 'zc_course.course_title', 'zc_course.custom_url', 'zc_course.timestamp', 'page_view.view_count_web', 'page_view.utm_source');
        
        // Get total count for pagination
        $total = $query->count();
        
        // Apply pagination
        $results = $query->orderBy('zc_course.timestamp', 'DESC')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        $data = $results->map(function ($item) {
            $customUrl = "https://hcp.medtalks.in/cme/" . $item->custom_url;
            
            // Get subscription count
            $subscribeCount = Subscribe::where('ref_id', $item->course_id)
                ->where('ref_id', $item->course_id)
                ->where('type', 'cme')
                ->where('status', 'subscribed')
                ->distinct('user_id')
                ->count('user_id');
            
            return [
                'id' => $item->course_id,
                'title' => $item->title,
                'custom_url' => $customUrl,
                'date_time' => $item->date_time,
                'view_count_web' => $item->view_count_web,
                'utm_details' => $item->utm_source,
                'subscribe_count' => $subscribeCount
            ];
        });
        
        // Prepare pagination data
        $pagination = [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total)
        ];
        
        return ['data' => $data, 'pagination' => $pagination];
    }
    
    /**
     * Get Seminar/Webinar data
     */
    private function getSeminarData($page = 1, $perPage = 10)
    {
        $query = PageView::where('article_type', 'WEBINAR')
            ->join('seminar', 'page_view.article_id', '=', 'seminar.seminar_no')
            ->where('seminar.video_status', '!=', 'deleted')
            ->select(
                'page_view.article_id as seminar_no',
                'seminar.seminar_title as title',
                'seminar.custom_url',
                'seminar.timestamp as date_time',
                'page_view.view_count_web'
            );
        
        // Get total count for pagination
        $total = $query->count();
        
        // Apply pagination
        $results = $query->orderBy('seminar.timestamp', 'DESC')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        $data = $results->map(function ($item) {
            $customUrl = "https://www.medtalks.in/live-seminar/" . $item->custom_url;
            
            // Get subscription count
            $subscribeCount = Subscribe::where('ref_id', $item->seminar_no)
                ->where('ref_id', $item->seminar_no)
                ->where('type', 'seminar')
                ->distinct('user_id')
                ->count('user_id');
            
            return [
                'id' => $item->seminar_no,
                'title' => $item->title,
                'custom_url' => $customUrl,
                'date_time' => $item->date_time,
                'view_count_web' => $item->view_count_web,
                'utm_details' => '',
                'subscribe_count' => $subscribeCount
            ];
        });
        
        // Prepare pagination data
        $pagination = [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total)
        ];
        
        return ['data' => $data, 'pagination' => $pagination];
    }
    
    /**
     * Get Episode data
     */
    private function getEpisodeData($episodeType, $page = 1, $perPage = 10)
    {
        $query = PageView::where('article_type', 'MEDTALKSTV')
            ->join('medtalks_tv', 'page_view.article_id', '=', 'medtalks_tv.id')
            ->where('medtalks_tv.episode_status', 'active')
            ->where('medtalks_tv.video_status', '!=', 'deleted')
            ->where('medtalks_tv.episode_type', $episodeType)
            ->select(
                'page_view.article_id as id',
                'medtalks_tv.title',
                'medtalks_tv.custom_url',
                'medtalks_tv.timestamp as date_time',
                'page_view.view_count_web'
            );
        
        // Get total count for pagination
        $total = $query->count();
        
        // Apply pagination
        $results = $query->orderBy('medtalks_tv.timestamp', 'DESC')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        $data = $results->map(function ($item) {
            $customUrl = "https://www.medtalks.in/tv-view/" . $item->custom_url;
            
            // Get subscription count
            $subscribeCount = Subscribe::where('ref_id', $item->id)
                ->where('ref_id', $item->id)
                ->where('type', 'episode')
                ->distinct('user_id')
                ->count('user_id');
            
            return [
                'id' => $item->id,
                'title' => $item->title,
                'custom_url' => $customUrl,
                'date_time' => $item->date_time,
                'view_count_web' => $item->view_count_web,
                'utm_details' => '',
                'subscribe_count' => $subscribeCount
            ];
        });
        
        // Prepare pagination data
        $pagination = [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total)
        ];
        
        return ['data' => $data, 'pagination' => $pagination];
    }
    
    /**
     * Get Specialty data
     */
    private function getSpecData($page = 1, $perPage = 10)
    {
        $query = PageView::where('article_type', 'SPEC')
            ->join('user_specialty', 'page_view.article_id', '=', 'user_specialty.no')
            ->where('user_specialty.status', 'on')
            ->select(
                'page_view.article_id as id',
                'user_specialty.title',
                'user_specialty.custom_url',
                DB::raw('SUM(page_view.view_count_web) as view_count_web'),
                DB::raw("GROUP_CONCAT(CONCAT(IF(page_view.utm_source='', 'original', page_view.utm_source), ':', page_view.view_count_web) SEPARATOR ', ') as utm_details")
            )
            ->groupBy('page_view.article_id', 'user_specialty.title', 'user_specialty.custom_url');
        
        // Get total count for pagination
        $total = $query->count();
        
        // Apply pagination
        $results = $query->orderBy('user_specialty.title', 'DESC')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        $data = $results->map(function ($item) {
            // Generate URL based on ID
            if ($item->id == 389) {
                $customUrl = "https://pediatricscasestudy.medtalks.in/case-studies";
            } elseif ($item->custom_url == "clinical-update") {
                $customUrl = "https://www.medtalks.in/faq/clinical-updates";
            } else {
                $customUrl = "https://www.medtalks.in/oral-hygiene-articles/" . $item->custom_url;
            }
            
            return [
                'id' => $item->id,
                'title' => $item->title,
                'custom_url' => $customUrl,
                'date_time' => '',
                'view_count_web' => $item->view_count_web,
                'utm_details' => $item->utm_details,
                'subscribe_count' => 0 // Not applicable for specialties
            ];
        });
        
        // Prepare pagination data
        $pagination = [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total)
        ];
        
        return ['data' => $data, 'pagination' => $pagination];
    }
    
    /**
     * Get FAQ data for a specific specialty
     */
    private function getSpecFaqData($specId, $page = 1, $perPage = 10)
    {
        $query = PageView::where('article_type', 'FAQ')
            ->join('post', 'page_view.article_id', '=', 'post.articleID')
            ->where('post.status', 'published')
            ->where('post.catagory1', $specId)
            ->select(
                'page_view.article_id',
                'post.title',
                'post.custom_url',
                'post.post_date as date_time',
                'post.catagory1',
                'page_view.view_count_web'
            );
        
        // Get total count for pagination
        $total = $query->count();
        
        // Apply pagination
        $results = $query->orderBy('post.articleID', 'DESC')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        $data = $results->map(function ($item) {
            // Generate URL based on category
            if ($item->catagory1 == "388") {
                $customUrl = "https://www.medtalks.in/articles/" . $item->custom_url;
            } else {
                $customUrl = "https://www.medtalks.in/oral-hygiene-articles/" . $item->custom_url;
            }
            
            return [
                'id' => $item->article_id,
                'title' => $item->title,
                'custom_url' => $customUrl,
                'date_time' => $item->date_time,
                'view_count_web' => $item->view_count_web,
                'utm_details' => '',
                'subscribe_count' => 0 // Not applicable for this view
            ];
        });
        
        // Prepare pagination data
        $pagination = [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total)
        ];
        
        return ['data' => $data, 'pagination' => $pagination];
    }
}