use anchor_lang::prelude::*;

declare_id!("DcUJPJZDTW9pSFmfpxoQkedaAv3UCdbhDLEHHiK2rZBx");

#[program]
pub mod sol_escrow {
    use super::*;

    pub fn initialize(
        context: Context<Initialize>,
        taker: Pubkey,
        amount: u64,
    ) -> Result<()> {
        let escrow_account = &mut context.accounts.escrow_account;
        escrow_account.initializer = *context.accounts.initializer.key;
        escrow_account.taker = taker;
        escrow_account.amount = amount;
        msg!("Escrow initialized: {} will send {} lamports to {}", escrow_account.initializer, amount, escrow_account.taker);
        Ok(())
    }

    pub fn withdraw(context: Context<Withdraw>) -> Result<()> {
        let escrow_account = &context.accounts.escrow_account;
        require_keys_eq!(escrow_account.taker, context.accounts.taker.key(), CustomError::Unauthorized);

        msg!("{} lamports withdrawn by {}", escrow_account.amount, escrow_account.taker);
        Ok(())
    }

    pub fn cancel(context: Context<Cancel>) -> Result<()> {
        let escrow_account = &context.accounts.escrow_account;
        require_keys_eq!(
            escrow_account.initializer,
            context.accounts.initializer.key(),
            CustomError::Unauthorized
        );

        msg!("{} lamports returned to initializer {}", escrow_account.amount, escrow_account.initializer);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = initializer,
        space = 8 + Escrow::LEN,
        seeds = [b"escrow", initializer.key().as_ref()],
        bump
    )]
    pub escrow_account: Account<'info, Escrow>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = taker, close = taker)]
    pub escrow_account: Account<'info, Escrow>,
    #[account(mut)]
    pub taker: Signer<'info>,
}

#[derive(Accounts)]
pub struct Cancel<'info> {
    #[account(mut, has_one = initializer, close = initializer)]
    pub escrow_account: Account<'info, Escrow>,
    #[account(mut)]
    pub initializer: Signer<'info>,
}

#[account]
pub struct Escrow {
    pub initializer: Pubkey,
    pub taker: Pubkey,
    pub amount: u64,
}

impl Escrow {
    pub const LEN: usize = 32 + 32 + 8;
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized taker")]
    Unauthorized,
}
