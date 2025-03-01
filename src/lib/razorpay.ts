// Razorpay integration utilities
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  export interface PaymentOptions {
    amount: number; // in paise (100 paise = 1 INR)
    currency: string;
    name: string;
    description: string;
    orderId?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
  }
  
  export const initiateRazorpayPayment = (
    options: PaymentOptions
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    return new Promise(async (resolve) => {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        resolve({ 
          success: false, 
          error: 'Razorpay SDK failed to load. Please check your internet connection.' 
        });
        return;
      }
  
      const razorpayOptions = {
        key :process.env.RAZORPAY_TEST_KEY, // Test Key ID
        amount: options.amount,
        currency: options.currency || 'INR',
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        handler: function (response: any) {
          resolve({
            success: true,
            data: response
          });
        },
        prefill: options.prefill || {},
        notes: options.notes || {},
        theme: options.theme || { color: '#8b5cf6' },
        modal: {
          ondismiss: function() {
            resolve({
              success: false,
              error: 'Payment cancelled by user'
            });
          }
        }
      };
  
      try {
        const paymentObject = new (window as any).Razorpay(razorpayOptions);
        paymentObject.open();
      } catch (err) {
        resolve({
          success: false,
          error: 'Failed to initialize Razorpay payment.'
        });
      }
    });
  };