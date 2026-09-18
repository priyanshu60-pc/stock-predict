-- Create Paper Portfolio Table
CREATE TABLE IF NOT EXISTS public.paper_portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 100000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Paper Trades Table
CREATE TABLE IF NOT EXISTS public.paper_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    trade_type TEXT NOT NULL CHECK (trade_type IN ('LONG', 'SHORT')),
    entry_price NUMERIC NOT NULL,
    exit_price NUMERIC,
    quantity INTEGER NOT NULL,
    stop_loss NUMERIC,
    target_price NUMERIC,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    pnl NUMERIC DEFAULT 0.00,
    journal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.paper_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_trades ENABLE ROW LEVEL SECURITY;

-- Policies for Paper Portfolio
CREATE POLICY "Users can view their own paper portfolio" ON public.paper_portfolio
    FOR SELECT USING (auth.uid()::text = user_id);
    
CREATE POLICY "Users can insert their own paper portfolio" ON public.paper_portfolio
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    
CREATE POLICY "Users can update their own paper portfolio" ON public.paper_portfolio
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Policies for Paper Trades
CREATE POLICY "Users can view their own paper trades" ON public.paper_trades
    FOR SELECT USING (auth.uid()::text = user_id);
    
CREATE POLICY "Users can insert their own paper trades" ON public.paper_trades
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    
CREATE POLICY "Users can update their own paper trades" ON public.paper_trades
    FOR UPDATE USING (auth.uid()::text = user_id);
