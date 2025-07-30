// services/settings.service.ts  
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsService {
  static async getAllSettings() {
    // You can store settings in database or config files
    // This is a basic implementation
    return {
      site_name: process.env.SITE_NAME || 'E-Commerce Store',
      site_description: process.env.SITE_DESCRIPTION || 'Your online store',
      site_logo: process.env.SITE_LOGO || '',
      site_favicon: process.env.SITE_FAVICON || '',
      admin_email: process.env.ADMIN_EMAIL || 'admin@example.com',
      support_email: process.env.SUPPORT_EMAIL || 'support@example.com',
      phone: process.env.PHONE || '',
      address: process.env.ADDRESS || '',
      
      // Currency settings
      default_currency: process.env.DEFAULT_CURRENCY || 'USD',
      currency_symbol: process.env.CURRENCY_SYMBOL || '$',
      currency_position: process.env.CURRENCY_POSITION || 'before',
      decimal_places: parseInt(process.env.DECIMAL_PLACES || '2'),
      thousands_separator: process.env.THOUSANDS_SEPARATOR || ',',
      decimal_separator: process.env.DECIMAL_SEPARATOR || '.',
      default_country: process.env.DEFAULT_COUNTRY || 'US',
      default_timezone: process.env.DEFAULT_TIMEZONE || 'America/New_York',
      date_format: process.env.DATE_FORMAT || 'MM/DD/YYYY',
      time_format: process.env.TIME_FORMAT || '12',
      
      // Business settings
      tax_rate: parseFloat(process.env.TAX_RATE || '0'),
      tax_inclusive: process.env.TAX_INCLUSIVE === 'true',
      free_shipping_threshold: parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '0'),
      default_shipping_cost: parseFloat(process.env.DEFAULT_SHIPPING_COST || '0'),
      order_prefix: process.env.ORDER_PREFIX || 'ORD-',
      invoice_prefix: process.env.INVOICE_PREFIX || 'INV-',
      low_stock_threshold: parseInt(process.env.LOW_STOCK_THRESHOLD || '5'),
      
      // Payment methods
      payment_methods: {
        stripe_enabled: process.env.STRIPE_ENABLED === 'true',
        stripe_public_key: process.env.STRIPE_PUBLIC_KEY || '',
        stripe_secret_key: process.env.STRIPE_SECRET_KEY || '',
        paypal_enabled: process.env.PAYPAL_ENABLED === 'true',
        paypal_client_id: process.env.PAYPAL_CLIENT_ID || '',
        paypal_client_secret: process.env.PAYPAL_CLIENT_SECRET || '',
        cod_enabled: process.env.COD_ENABLED === 'true',
      },
      
      // Email settings
      smtp_host: process.env.SMTP_HOST || '',
      smtp_port: parseInt(process.env.SMTP_PORT || '587'),
      smtp_username: process.env.SMTP_USERNAME || '',
      smtp_password: process.env.SMTP_PASSWORD || '',
      smtp_encryption: process.env.SMTP_ENCRYPTION || 'tls',
      mail_from_address: process.env.MAIL_FROM_ADDRESS || '',
      mail_from_name: process.env.MAIL_FROM_NAME || '',
      
      // Notification settings
      email_notifications: {
        new_order: process.env.NOTIFY_NEW_ORDER === 'true',
        low_stock: process.env.NOTIFY_LOW_STOCK === 'true',
        new_review: process.env.NOTIFY_NEW_REVIEW === 'true',
        new_user: process.env.NOTIFY_NEW_USER === 'true',
      },
      
      // SEO settings
      meta_title: process.env.META_TITLE || '',
      meta_description: process.env.META_DESCRIPTION || '',
      meta_keywords: process.env.META_KEYWORDS || '',
      google_analytics_id: process.env.GOOGLE_ANALYTICS_ID || '',
      facebook_pixel_id: process.env.FACEBOOK_PIXEL_ID || '',
      
      // Social media
      social_links: {
        facebook: process.env.FACEBOOK_URL || '',
        twitter: process.env.TWITTER_URL || '',
        instagram: process.env.INSTAGRAM_URL || '',
        linkedin: process.env.LINKEDIN_URL || '',
        youtube: process.env.YOUTUBE_URL || '',
      },
      
      // Security settings
      enable_registration: process.env.ENABLE_REGISTRATION !== 'false',
      email_verification: process.env.EMAIL_VERIFICATION === 'true',
      two_factor_auth: process.env.TWO_FACTOR_AUTH === 'true',
      password_min_length: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
      session_timeout: parseInt(process.env.SESSION_TIMEOUT || '1440'),
      
      // Maintenance
      maintenance_mode: process.env.MAINTENANCE_MODE === 'true',
      maintenance_message: process.env.MAINTENANCE_MESSAGE || 'We are currently under maintenance. Please check back later.',
    };
  }

  static async updateSettings(data: any) {
    // In a real implementation, you'd save these to database
    // For now, this is a placeholder
    return data;
  }
}
