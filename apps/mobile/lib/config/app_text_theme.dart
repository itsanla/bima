import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextTheme {
  AppTextTheme._();

  static TextTheme get textTheme {
    return GoogleFonts.interTextTheme().copyWith(
      // Heading 1: Top Bar
      titleLarge: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600, // SemiBold
        color: AppColors.textDark,
        height: 24 / 18,
        letterSpacing: -0.025,
      ),
      // Heading 2: "Running"
      titleMedium: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600, // SemiBold
        color: AppColors.textDark,
        height: 32 / 24,
      ),
      // Heading 3: "Daily Summary"
      titleSmall: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600, // SemiBold
        color: AppColors.textDark,
        height: 24 / 18,
      ),
      // Body Large: "92", "12"
      bodyLarge: GoogleFonts.inter(
        fontSize: 28,
        fontWeight: FontWeight.w400, // Regular
        color: AppColors.textDark,
        height: 35 / 28,
      ),
      // Body Medium: Labels "Current Temperature", "Fire Status"
      bodyMedium: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500, // Medium
        color: AppColors.textGray,
        height: 16 / 12,
        letterSpacing: 0.05,
      ),
      // Caption
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500, // Medium
        color: AppColors.textGray,
        height: 15 / 12,
        letterSpacing: 0.05,
      ),
      // Display Temp
      displayLarge: GoogleFonts.inter(
        fontSize: 48,
        fontWeight: FontWeight.w700, // Bold
        color: AppColors.textDark,
        height: 56 / 48,
        letterSpacing: -0.02,
      ),
      // Used for specific monospace timer
      displayMedium: GoogleFonts.robotoMono(
        fontSize: 48,
        fontWeight: FontWeight.w700, // Bold
        color: AppColors.textDark,
        height: 56 / 48,
        letterSpacing: -0.05,
      ),
    );
  }
}
