use anchor_lang::prelude::*;

declare_id!("3vXTDchzLSC683QqkdBT8VYWk2baJXMEtgTYoXaqFjGy");

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
        let escrow_account = &mut context.accounts.escrow_account;
        require_keys_eq!(escrow_account.taker, context.accounts.taker.key(), CustomError::Unauthorized);

        let amount = escrow_account.amount;
        **context.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= amount;
        **context.accounts.taker.try_borrow_mut_lamports()? += amount;

        msg!("{} lamports withdrawn by {}", amount, escrow_account.taker);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = initializer, space = 8 + 32 + 32 + 8)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = taker)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub taker: Signer<'info>,
}

#[account]
pub struct EscrowAccount {
    pub initializer: Pubkey,
    pub taker: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized taker")]
    Unauthorized,
}
