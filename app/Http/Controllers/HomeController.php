<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use Illuminate\Support\Facades\Response;

class HomeController extends Controller
{
    public function downloadPdf()
    {
        $company = CompanyProfile::first();

        if ($company) {
            $mediaItems = $company->getMedia();
            if ($mediaItems->isNotEmpty()) {
                $media = $mediaItems->first();
                $file_name = 'Company Profile Pdf';

                $headers = [
                    'Content-type' => $media->mime_type,
                    'Content-Disposition' => "attachment; filename=$file_name",
                ];

                $callback = function () use ($media) {
                    $file = fopen($media->getPath(), 'rb');
                    fpassthru($file);
                    fclose($file);
                };

                return Response::stream($callback, 200, $headers);
            }
        }
        abort(404, 'PDF not found');
    }
}
