<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FrontendUser extends Model
{
    use HasFactory;

    protected $table = 'frontend_users';
    
    protected $primaryKey = 'user_no';

    protected $fillable = [
        'title',
        'user_id',
        'user_email',
        'user_phone',
        'user_Fname',
        'user_Lname',
        'user_FullName',
        'password',
        'user_dob',
        'gender',
        'userType',
        'userStatus',
        'activation_code',
        'username',
        'validate',
        'validate_email_send',
        'lastActive',
        'welcome_flag',
        'profileAttentionStatus',
        'email_validate',
        'contact_validation',
        'site_login',
        'facbook_login',
        'google_login',
        'twitter_login',
        'facbook_login_id',
        'activity_score',
        'user_score',
        'google_login_id',
        'last_login_ip',
        'user_img',
        'specialities',
        'professional',
        'profession',
        'Interest',
        'MedicalBoard',
        'MedicalRegistratioNo',
        'MRNVerified',
        'userLocality',
        'userCountry',
        'userState',
        'accessCodeID',
        'sem_chat_status',
        'authKey',
        'chat_moderator',
        'elivatorPitch',
        'custom_url',
        'seo_pageTitle',
        'seo_metaKeywords',
        'seo_metaDesctiption',
        'seo_metaImage',
        'seo_OgTitle',
        'seo_canonical',
        'alt_image',
        'is_verified_certificate',
        'reg_certificate',
        'register_via',
        'country_code',
        'reg_source',
        'cme_count',
        'hospital_affiliation',
        'zip_code',
        'sem_count',
        'post_english_count',
        'post_hindi_count',
        'mt_count',
        'total_count',
        'browser',
        'modified_by',
        'year_of_practice',
        'verification_source',
        'med_data_verified',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $casts = [
        'timestamp' => 'datetime',
        'updated' => 'datetime',
    ];
}