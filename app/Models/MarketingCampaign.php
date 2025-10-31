<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BusinessPage;

class MarketingCampaign extends Model
{
    protected $table = 'marketing_campaigns';
    
    protected $primaryKey = 'campaignID';
    
    public $timestamps = true;
    
    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'modified_on';
    
    protected $fillable = [
        'businessID',
        'campaignType',
        'campaignMission',
        'campaignTitle',
        'campaignTargetID',
        'promotionTimeSettings',
        'campaignStartTime',
        'campaignEndTime',
        'campaignStatus',
        'campaignViews',
        'campaignSubscritions',
        'camapignSecretCode',
        'lockAccess',
        'lastupdated',
        'marketingBannerSquare',
        'marketingBannerRectangle',
        'marketingBanner1',
        'marketingBanner2',
        'marketingBanner3',
        'marketingBanner4',
        'created_by',
        'created_ip',
        'modified_by',
        'modified_ip',
        'deactivated_by',
        'deactivated_on',
        'deactivated_ip',
    ];
    
    protected $casts = [
        'lastupdated' => 'datetime',
        'campaignStartTime' => 'datetime',
        'created_on' => 'datetime',
        'modified_on' => 'datetime',
        'deactivated_on' => 'datetime',
    ];
    
    public function business()
    {
        return $this->belongsTo(BusinessPage::class, 'businessID', 'businessID');
    }
}