Add-Type -AssemblyName System.Drawing

$iconSource = "C:\Users\ahmed\.gemini\antigravity\brain\a7e2f265-03ed-4607-a53c-1e694334e91e\spotsaver_premium_icon_1786970923602.jpg"
$splashSource = "C:\Users\ahmed\.gemini\antigravity\brain\a7e2f265-03ed-4607-a53c-1e694334e91e\catchy_splash_screen_1786971772766.jpg"
$resDir = "d:\My codes Workspace\Mobile Apps\parking reminder app\spotsaver\android\app\src\main\res"
$publicDir = "d:\My codes Workspace\Mobile Apps\parking reminder app\spotsaver\public"

# Copy to public folder
Copy-Item $iconSource -Destination (Join-Path $publicDir "spotsaver_icon_512.png") -Force
Copy-Item $iconSource -Destination (Join-Path $publicDir "spotsaver_icon_192.png") -Force
Copy-Item $splashSource -Destination (Join-Path $publicDir "spotsaver_splash.png") -Force

# Generate all mipmap launcher icon sizes
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$srcIconImg = [System.Drawing.Image]::FromFile($iconSource)

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $targetDir = Join-Path $resDir $folder
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $destBmp = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($destBmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($srcIconImg, 0, 0, $size, $size)
    $graphics.Dispose()

    $destBmp.Save((Join-Path $targetDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Save((Join-Path $targetDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Save((Join-Path $targetDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Host "Generated crisp $folder ($size x $size)"
}

$srcIconImg.Dispose()

# Generate Splash screens for all drawable folders
$splashSizes = @{
    "drawable" = @{ w = 720; h = 1280 }
    "drawable-port-mdpi" = @{ w = 320; h = 480 }
    "drawable-port-hdpi" = @{ w = 480; h = 800 }
    "drawable-port-xhdpi" = @{ w = 720; h = 1280 }
    "drawable-port-xxhdpi" = @{ w = 960; h = 1600 }
    "drawable-port-xxxhdpi" = @{ w = 1280; h = 1920 }
    "drawable-land-mdpi" = @{ w = 480; h = 320 }
    "drawable-land-hdpi" = @{ w = 800; h = 480 }
    "drawable-land-xhdpi" = @{ w = 1280; h = 720 }
    "drawable-land-xxhdpi" = @{ w = 1600; h = 960 }
    "drawable-land-xxxhdpi" = @{ w = 1920; h = 1280 }
    "drawable-v24" = @{ w = 720; h = 1280 }
}

$srcSplashImg = [System.Drawing.Image]::FromFile($splashSource)

foreach ($folder in $splashSizes.Keys) {
    $targetDir = Join-Path $resDir $folder
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    $w = $splashSizes[$folder].w
    $h = $splashSizes[$folder].h

    $destSplashBmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($destSplashBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcSplashImg, 0, 0, $w, $h)
    $g.Dispose()

    $destSplashBmp.Save((Join-Path $targetDir "splash.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destSplashBmp.Dispose()
    Write-Host "Generated splash for $folder ($w x $h)"
}

$srcSplashImg.Dispose()
Write-Host "All Android icons and catchy splash screens successfully generated!"
